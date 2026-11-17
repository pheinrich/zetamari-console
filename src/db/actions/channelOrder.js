'use server'

import { notFound, unauthorized } from 'next/navigation'

import PostalMime from 'postal-mime'
import { Sequelize } from 'sequelize'

import ChannelOrder from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import InboundEmail from '@/db/models/InboundEmail'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { processInboundEmail, undoInboundEmail as undoProcessing } from '@/libs/channelOrders/ingest'
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
      [Sequelize.fn( 'COUNT', Sequelize.col( 'productId' ) ), 'matchedCount'],
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
    include: [{model: ChannelOrderLine, as: 'Lines', include: [{model: Product, attributes: ['id', 'name', 'sku']}]}],
    order: [[{model: ChannelOrderLine, as: 'Lines'}, 'position', 'ASC']],
  } )

  if( !order )
    notFound()

  const emails = await InboundEmail.findAll( {where: {channelOrderId: id}, attributes: EMAIL_LIST_ATTRIBUTES, order: [['receivedAt', 'ASC']]} )

  return {...order.toJSON(), emails: emails.map( e => e.toJSON() )}
}

// Dismissing parks an order that won't become an Order (a class
// registration, a test, a duplicate); restoring returns it to 'new'.
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

// Retry every failed email - e.g. after a parser fix is deployed.
export async function reprocessFailedEmails()
{
  await requireSession()

  const failed = await InboundEmail.findAll( {where: {status: 'failed'}} )
  const results = []

  for( const email of failed )
    results.push( await processInboundEmail( email ) )

  return {total: results.length, failed: results.filter( r => r.status === 'failed' ).length}
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
