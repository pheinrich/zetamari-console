'use server'

import { notFound, unauthorized } from 'next/navigation'

import PostalMime from 'postal-mime'
import { Op, Sequelize } from 'sequelize'

import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import InboundEmail from '@/db/models/InboundEmail'
import LiveClass from '@/db/models/LiveClass'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import Person from '@/db/models/Person'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { seedDiscountIfEligible } from '@/db/actions/person'
import { markOrdersScheduleStale } from '@/db/actions/scheduling'
import { acceptChannelOrder as accept, isClassSeatLine, previewAccept, unacceptChannelOrder as unaccept } from '@/libs/channelOrders/accept'
import { liveClassOptions } from '@/libs/channelOrders/classSeats'
import { etsyConnection } from '@/libs/channelOrders/etsyApi'
import { matchOpenLinesWithSku, rememberAlias } from '@/libs/channelOrders/matching'
import { deleteInboundEmail as deleteEmail, processInboundEmail, refreshChannelOrderFromApi, undoInboundEmail as undoProcessing } from '@/libs/channelOrders/ingest'
import { auth } from '@/lib/auth'

// Review of order intake - Channel Orders staged from sales-channel
// emails, and the Inbound Emails they came from (CONTEXT.md's Order
// intake section). `raw` (the stored email, up to MBs) is left out of
// every list query; only readInboundEmail() decodes it, for one email.

const EMAIL_LIST_ATTRIBUTES = ['id', 'messageId', 'fromAddress', 'subject', 'sentAt', 'receivedAt', 'channel', 'kind', 'status', 'error', 'channelOrderId']

async function requireSession()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
}

export async function readChannelOrders()
{
  await requireSession()

  const orders = await ChannelOrder.findAll( {order: [['createdAt', 'DESC']]} )

  if( !orders.length )
    return []

  // Line and matched-line counts per order, grouped rather than eager-
  // loading every line just to count them.
  const counts = await ChannelOrderLine.findAll( {
    where: {channelOrderId: orders.map( o => o.id )},
    attributes: [
      'channelOrderId',
      [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'lineCount'],
      [Sequelize.fn( 'COUNT', Sequelize.fn( 'COALESCE', Sequelize.col( 'productId' ), Sequelize.col( 'liveClassId' ) ) ), 'matchedCount'],
    ],
    group: ['channelOrderId'],
  } )

  const countsById = Object.fromEntries( counts.map( c => [c.channelOrderId, {lineCount: Number( c.get( 'lineCount' ) ), matchedCount: Number( c.get( 'matchedCount' ) )}] ) )

  return orders.map( o => ({...o.toJSON(), lineCount: 0, matchedCount: 0, ...countsById[o.id]}) )
}

export async function readChannelOrder( id )
{
  await requireSession()

  const order = await ChannelOrder.findByPk( id, {
    include: [{model: ChannelOrderLine, as: 'Lines', include: [{model: Product, attributes: ['id', 'name', 'sku']}, {model: LiveClass, attributes: ['id', 'name']}]}],
    order: [[{model: ChannelOrderLine, as: 'Lines'}, 'position', 'ASC']],
  } )

  if( !order )
    notFound()

  const lineIds = order.Lines.map( l => l.id )

  const [emails, links, seats] = await Promise.all( [
    InboundEmail.findAll( {where: {channelOrderId: id}, attributes: EMAIL_LIST_ATTRIBUTES, order: [['receivedAt', 'ASC']]} ),
    ChannelOrderOrder.findAll( {where: {channelOrderId: id}, order: [['orderId', 'ASC']]} ),
    lineIds.length ? LiveClassAttendee.findAll( {where: {channelOrderLineId: lineIds}, attributes: ['id', 'liveClassId', 'channelOrderLineId']} ) : [],
  ] )

  // The Order(s) it was accepted into - several once one has been split -
  // and the Live Classes its class seats were enrolled in.
  return {
    ...order.toJSON(),
    Lines: order.Lines.map( l => ({...l.toJSON(), classSeat: isClassSeatLine( l ), seatCount: seats.filter( a => a.channelOrderLineId === l.id ).length}) ),
    emails: emails.map( e => e.toJSON() ),
    orderIds: links.map( l => l.orderId ),
    liveClassIds: [...new Set( seats.map( a => a.liveClassId ) )],
  }
}

// Every Product, in just enough detail to pick one as a line's match
// (~1,600 rows; the picker ranks and filters them in the browser).
export async function readProductOptions()
{
  await requireSession()

  const products = await Product.findAll( {attributes: ['id', 'sku', 'name', 'status'], order: [['sku', 'ASC']]} )

  return products.map( p => p.toJSON() )
}

// Lines still to be matched to a Product on orders under review, each
// with its order, for the unmatched-lines queue. Class seats aren't
// Products - they're matched to a class on their order's page.
export async function readUnmatchedLines()
{
  await requireSession()

  const lines = await ChannelOrderLine.findAll( {
    where: {productId: null, liveClassId: null},
    include: [{model: ChannelOrder, where: {status: 'new'}, attributes: ['id', 'channel', 'externalOrderId', 'orderedOn', 'buyerCompany', 'buyerName']}],
    order: [['sku', 'ASC'], ['id', 'ASC']],
  } )

  return lines.filter( l => !isClassSeatLine( l ) ).map( l => l.toJSON() )
}

// Live Classes a class-seat line can be matched to: recent and upcoming
// ones, plus any of `include` (classes lines are already matched to).
export async function readLiveClassOptions( include = [] )
{
  await requireSession()

  return liveClassOptions( {include: include.filter( Boolean ).map( Number )} )
}

// Matches a class-seat line to a Live Class (or unmatches it, with
// liveClassId null), on an order still under review.
export async function matchChannelOrderLineClass( lineId, liveClassId )
{
  await requireSession()

  const line = await ChannelOrderLine.findByPk( lineId, {include: [{model: ChannelOrder, attributes: ['status']}]} )

  if( !line )
    notFound()

  if( line.ChannelOrder.status !== 'new' )
    return {error: `This order is ${line.ChannelOrder.status} - restore it to new first`}

  if( liveClassId && !await LiveClass.count( {where: {id: liveClassId}} ) )
    return {error: 'That class no longer exists'}

  await line.update( {liveClassId: liveClassId ?? null, productId: null} )

  return {success: true}
}

// Matches one Channel Order Line to a Product (or unmatches it, with
// productId null), on an order still under review. With `remember`, the
// line's SKU also becomes a Product Alias - so later orders with that SKU
// match on arrival - and every other open line with the same SKU is
// matched now. Returns how many other lines that matched.
export async function matchChannelOrderLine( lineId, productId, {remember = false} = {} )
{
  await requireSession()

  const line = await ChannelOrderLine.findByPk( lineId, {include: [{model: ChannelOrder, attributes: ['status', 'channel']}]} )

  if( !line )
    notFound()

  if( line.ChannelOrder.status !== 'new' )
    return {error: `This order is ${line.ChannelOrder.status} - restore it to new first`}

  if( productId && !await Product.count( {where: {id: productId}} ) )
    return {error: 'That product no longer exists'}

  return sequelize.transaction( async transaction => {
    await line.update( {productId: productId ?? null}, {transaction} )

    let alsoMatched = 0, remembered = false

    if( remember && productId && line.sku )
    {
      remembered = await rememberAlias( line.sku, productId, line.ChannelOrder.channel, transaction )
      alsoMatched = await matchOpenLinesWithSku( line.sku, productId, transaction )
    }

    return {success: true, remembered, alsoMatched}
  } )
}

// --- Accepting into an Order (see libs/channelOrders/accept.js) ---

// What the Accept dialog needs: blockers, lines, customer candidates.
export async function readAcceptPreview( id )
{
  await requireSession()

  const order = await ChannelOrder.findByPk( id )

  if( !order )
    notFound()

  return previewAccept( order )
}

// People matching typed text by name, company or email - for choosing a
// customer other than the suggested ones.
export async function searchCustomers( text )
{
  await requireSession()

  const words = (text ?? '').trim().split( /\s+/ ).filter( w => w.length > 1 ).slice( 0, 4 )

  if( !words.length )
    return []

  const people = await Person.findAll( {
    where: {[Op.and]: words.map( w => ({[Op.or]: ['firstName', 'lastName', 'company', 'email'].map( c => ({[c]: {[Op.like]: `%${w}%`}}) )}) )},
    attributes: ['id', 'firstName', 'lastName', 'company', 'email'],
    limit: 20,
  } )

  return people.map( p => ({
    id: p.id,
    label: [[p.firstName, p.lastName].filter( Boolean ).join( ' ' ), p.company].filter( Boolean ).join( ' — ' ) || p.email || `Person #${p.id}`,
    email: p.email,
  }) )
}

export async function acceptChannelOrder( id, choices )
{
  await requireSession()

  try
  {
    const result = await accept( id, choices )

    if( result.orderId )
      await markOrdersScheduleStale( [result.orderId] )

    // Enough classes may now earn the customer the returning-student discount
    if( result.seatCount )
      await seedDiscountIfEligible( result.customerId )

    return {success: true, ...result}
  }
  catch( error )
  {
    return {error: error.message}
  }
}

export async function unacceptChannelOrder( id )
{
  await requireSession()

  try
  {
    return {success: true, ...await unaccept( id )}
  }
  catch( error )
  {
    return {error: error.message}
  }
}

// Dismissing parks an order that won't become an Order (a test, a
// duplicate); restoring returns it to 'new'.
// 'accepted' is set only by accepting it into an Order, not here.
export async function setChannelOrderStatus( id, status )
{
  await requireSession()

  if( !['new', 'dismissed'].includes( status ) )
    return {error: `Can't set a channel order to ${status} here`}

  const order = await ChannelOrder.findByPk( id )

  if( !order )
    notFound()

  if( order.status === 'accepted' )
    return {error: 'This order has already been accepted'}

  await order.update( {status} )

  return {success: true}
}

// Completes a Faire/Etsy order from its API - see refreshChannelOrderFromApi().
export async function refreshChannelOrder( id )
{
  await requireSession()

  const order = await ChannelOrder.findByPk( id )

  if( !order )
    notFound()

  try
  {
    return {success: true, ...await refreshChannelOrderFromApi( order )}
  }
  catch( error )
  {
    return {error: error.message}
  }
}

// Whether Etsy's API is set up and connected, for the Channel Orders page.
export async function readEtsyConnection()
{
  await requireSession()

  return etsyConnection()
}

export async function readInboundEmails()
{
  await requireSession()

  const emails = await InboundEmail.findAll( {
    attributes: EMAIL_LIST_ATTRIBUTES,
    include: [{model: ChannelOrder, attributes: ['id', 'channel', 'externalOrderId', 'status', 'total', 'subtotal']}],
    order: [['receivedAt', 'DESC']],
  } )

  return emails.map( e => e.toJSON() )
}

// One email with its decoded bodies and headers, for viewing the source.
export async function readInboundEmail( id )
{
  await requireSession()

  const email = await InboundEmail.findByPk( id, {include: [{model: ChannelOrder, attributes: ['id', 'channel', 'externalOrderId', 'status']}]} )

  if( !email )
    notFound()

  const {raw, ...rest} = email.toJSON()
  const parsed = await PostalMime.parse( raw )

  return {
    ...rest,
    html: parsed.html ?? null,
    text: parsed.text ?? null,
    headers: parsed.headers.map( h => ({key: h.key, value: h.value}) ),
    source: Buffer.from( raw ).toString( 'utf8' ),
  }
}

// "Redo": run the current parsers over a stored email again, replacing
// its Channel Order's lines with what the email says (forced - see
// processInboundEmail()). An accepted/dismissed order is left unchanged.
export async function reprocessInboundEmail( id )
{
  await requireSession()

  const email = await InboundEmail.findByPk( id )

  if( !email )
    notFound()

  return processInboundEmail( email, null, {force: true} )
}

// Batch "Redo" over the given emails - reprocessInboundEmail() for each.
// Counts those still failing, and those parsed but left unchanged because
// their channel order was already reviewed.
export async function reprocessInboundEmails( ids )
{
  await requireSession()

  const emails = await InboundEmail.findAll( {where: {id: ids}} )
  let failed = 0, unchanged = 0

  for( const email of emails )
  {
    const result = await processInboundEmail( email, null, {force: true} )

    if( result.status === 'failed' )
      failed += 1
    else if( result.status === 'parsed' && !result.updated )
      unchanged += 1
  }

  return {total: emails.length, failed, unchanged}
}

// "Undo": back to unprocessed - see ingest.js's undoInboundEmail().
export async function undoInboundEmail( id )
{
  await requireSession()

  const email = await InboundEmail.findByPk( id )

  if( !email )
    notFound()

  try
  {
    await undoProcessing( email )

    return {success: true}
  }
  catch( error )
  {
    return {error: error.message}
  }
}

// Batch "Undo" - undoInboundEmail() for each of the given emails that has
// been processed. Any that can't be (a channel order past 'new') are left
// and counted.
export async function undoInboundEmails( ids )
{
  return eachDetached( ids, {status: {[Op.ne]: 'received'}}, undoProcessing )
}

// Run an undo/delete over the given emails (narrowed by `where`), one at
// a time so each sees what the last did to a shared channel order.
async function eachDetached( ids, where, action )
{
  await requireSession()

  const emails = await InboundEmail.findAll( {where: {...where, id: ids}} )
  let failed = 0

  for( const email of emails )
  {
    try
    {
      await action( email )
    }
    catch
    {
      failed += 1
    }
  }

  return {total: emails.length, failed}
}

// Delete one stored email - see ingest.js's deleteInboundEmail().
export async function deleteInboundEmail( id )
{
  await requireSession()

  const email = await InboundEmail.findByPk( id )

  if( !email )
    notFound()

  try
  {
    await deleteEmail( email )

    return {success: true}
  }
  catch( error )
  {
    return {error: error.message}
  }
}

// Batch delete - deleteInboundEmail() for each of the given emails. Any
// that can't go (a channel order past 'new' still linked) are left and
// counted.
export async function deleteInboundEmails( ids )
{
  return eachDetached( ids, {}, deleteEmail )
}
