import { createHash } from 'crypto'

import PostalMime from 'postal-mime'
import { Op } from 'sequelize'

import ChannelOrder from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import InboundEmail from '@/db/models/InboundEmail'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { parseOrderEmail } from '@/libs/channelOrders'
import { fetchFaireOrder, withFaireApiOrder } from '@/libs/channelOrders/faireApi'

// Stores a raw RFC 5322 email (Buffer/string) as an InboundEmail, then
// processes it. Idempotent on Message-ID: redelivering an email that
// already parsed is a no-op, while one that previously failed is
// re-processed (so a sender's retry after a parser fix just works).
export async function ingestRawEmail( raw )
{
  await sequelize.sync()

  const bytes = Buffer.isBuffer( raw ) ? raw : Buffer.from( raw )
  const email = await PostalMime.parse( bytes )
  const messageId = email.messageId || `sha256:${createHash( 'sha256' ).update( bytes ).digest( 'hex' )}`

  let inbound = await InboundEmail.findOne( {where: {messageId}} )

  if( inbound && inbound.status !== 'failed' )
    return {inboundEmailId: inbound.id, status: inbound.status, duplicate: true, channelOrderId: inbound.channelOrderId}

  inbound ??= await InboundEmail.create( {
    messageId,
    fromAddress: email.from?.address ?? null,
    subject: email.subject?.slice( 0, 1024 ) ?? null,
    sentAt: email.date ? new Date( email.date ) : null,
    raw: bytes,
  } )

  return processInboundEmail( inbound, email )
}

// Classifies + parses one stored InboundEmail and upserts its Channel
// Order. Separate from ingestRawEmail() so stored mail can be replayed
// (`email` is the already-parsed MIME, re-derived from `raw` if absent).
// `force` is a person's explicit "reparse": the email's lines replace
// the order's even if there are fewer of them (see upsertChannelOrder()).
export async function processInboundEmail( inbound, email = null, {force = false} = {} )
{
  email ??= await PostalMime.parse( inbound.raw )

  let parsed

  try
  {
    parsed = parseOrderEmail( {from: email.from?.address, subject: email.subject, html: email.html, text: email.text, date: email.date} )
  }
  catch( error )
  {
    await inbound.update( {status: 'failed', error: error.message} )

    return {inboundEmailId: inbound.id, status: 'failed', error: error.message}
  }

  const {channel, kind} = parsed
  let {order} = parsed

  if( kind !== 'new-order' )
  {
    await inbound.update( {channel, kind, status: 'ignored', error: null} )

    return {inboundEmailId: inbound.id, status: 'ignored', channel, kind}
  }

  // Faire's email is a partial order; complete it from Faire's API. If
  // that fails the email's own lines are staged (flagged incomplete) and
  // the reason kept on the email - still 'parsed', since the email was.
  let apiError = null

  if( channel === 'faire' )
  {
    try
    {
      order = withFaireApiOrder( order, await fetchFaireOrder( order.externalOrderId ) )
    }
    catch( error )
    {
      apiError = `Faire API: ${error.message}`
    }
  }

  try
  {
    const {channelOrder, updated} = await sequelize.transaction( t => upsertChannelOrder( order, t, force ) )

    await inbound.update( {channel, kind, status: 'parsed', error: apiError, channelOrderId: channelOrder.id} )

    return {inboundEmailId: inbound.id, status: 'parsed', channel, kind, channelOrderId: channelOrder.id, updated, ...(apiError && {error: apiError})}
  }
  catch( error )
  {
    await inbound.update( {channel, kind, status: 'failed', error: error.message} )

    return {inboundEmailId: inbound.id, status: 'failed', channel, kind, error: error.message}
  }
}

// One Channel Order per (channel, externalOrderId). A repeat sighting
// refreshes a still-'new' order, but never lets a less complete source
// (e.g. Faire's four-line teaser) overwrite lines already filled in
// more fully - unless `force`d by a person reparsing; once accepted/
// dismissed it's left alone entirely. -> {channelOrder, updated}.
async function upsertChannelOrder( order, transaction, force = false )
{
  const fields = {
    channel: order.channel,
    externalOrderId: order.externalOrderId,
    orderedOn: order.orderedOn,
    requestedShipDate: order.requestedShipDate,
    paymentType: order.paymentType,
    buyerCompany: order.buyer.company,
    buyerName: order.buyer.name,
    buyerEmail: order.buyer.email,
    buyerPhone: order.buyer.phone,
    buyerExternalId: order.buyer.externalId,
    shipTo: order.shipTo,
    linesComplete: order.linesComplete,
    expectedLineCount: order.expectedLineCount,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    tax: order.tax ?? null,
    commission: order.commission,
    commissionLabel: order.commissionLabel ?? null,
    total: order.total,
    notes: order.notes,
  }

  const where = {channel: order.channel, externalOrderId: order.externalOrderId}
  let channelOrder = await ChannelOrder.findOne( {where, transaction, lock: transaction.LOCK.UPDATE} )

  if( channelOrder && channelOrder.status !== 'new' )
    return {channelOrder, updated: false}

  const existingLines = channelOrder ? await ChannelOrderLine.count( {where: {channelOrderId: channelOrder.id}, transaction} ) : 0

  if( channelOrder && !force && order.lines.length < existingLines )
    return {channelOrder, updated: false}

  if( channelOrder )
    await channelOrder.update( fields, {transaction} )
  else
    channelOrder = await ChannelOrder.create( fields, {transaction} )

  await replaceLines( channelOrder.id, order.lines, transaction )

  return {channelOrder, updated: true}
}

// A Channel Order's lines, replaced wholesale, each matched to a Product
// by exact SKU.
async function replaceLines( channelOrderId, lines, transaction )
{
  const productIdBySku = await matchSkus( lines.map( l => l.sku ), transaction )

  await ChannelOrderLine.destroy( {where: {channelOrderId}, transaction} )
  await ChannelOrderLine.bulkCreate( lines.map( (line, position) => ({
    channelOrderId,
    position,
    sku: line.sku,
    description: line.description?.slice( 0, 1024 ) ?? null,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    productId: line.sku ? productIdBySku.get( line.sku.trim().toLowerCase() ) ?? null : null,
  }) ), {transaction} )
}

// Re-fetches a stored Faire Channel Order from Faire's API, replacing its
// lines and amounts - for orders staged before the API was used, or when
// it was unreachable at intake. Only while the order is still 'new'.
// Clears a previous "Faire API:" error from its emails once it works.
export async function refreshFaireChannelOrder( channelOrder )
{
  if( channelOrder.channel !== 'faire' )
    throw new Error( 'Not a Faire order' )

  if( channelOrder.status !== 'new' )
    throw new Error( `This order is ${channelOrder.status} - restore it to new first` )

  const order = withFaireApiOrder( channelOrder.toJSON(), await fetchFaireOrder( channelOrder.externalOrderId ) )

  await sequelize.transaction( async transaction => {
    await channelOrder.update( {
      linesComplete: order.linesComplete,
      expectedLineCount: order.expectedLineCount,
      subtotal: order.subtotal,
      discount: order.discount,
      commission: order.commission,
      commissionLabel: order.commissionLabel,
      total: order.total,
    }, {transaction} )

    await replaceLines( channelOrder.id, order.lines, transaction )

    await InboundEmail.update(
      {error: null},
      {where: {channelOrderId: channelOrder.id, error: {[Op.startsWith]: 'Faire API:'}}, transaction}
    )
  } )

  return {lineCount: order.lines.length}
}

// Undoes processing of one InboundEmail: back to 'received', unlinked
// from its Channel Order. That order (and its lines) is deleted when no
// other email still feeds it - otherwise it's kept as those emails left
// it. Refused once the order has been accepted or dismissed, so undo
// can't quietly unwind a review decision.
export async function undoInboundEmail( inbound )
{
  await sequelize.transaction( async transaction => {
    const channelOrderId = inbound.channelOrderId
    const channelOrder = channelOrderId ? await ChannelOrder.findByPk( channelOrderId, {transaction, lock: transaction.LOCK.UPDATE} ) : null

    if( channelOrder && channelOrder.status !== 'new' )
      throw new Error( `Its channel order is ${channelOrder.status} - restore it to new first` )

    await inbound.update( {status: 'received', channel: null, kind: null, error: null, channelOrderId: null}, {transaction} )

    if( channelOrder && !await InboundEmail.count( {where: {channelOrderId}, transaction} ) )
      await channelOrder.destroy( {transaction} )
  } )
}

// Exact SKU match against Products, ignoring case and surrounding
// whitespace (the column's utf8mb3_unicode_ci collation already compares
// case-insensitively; the Map key mirrors that). Anything fuzzier -
// catching typo'd or renamed SKUs - belongs in the review step, where a
// person confirms it, not here.
async function matchSkus( skus, transaction )
{
  const wanted = [...new Set( skus.filter( Boolean ).map( s => s.trim() ) )]

  if( !wanted.length )
    return new Map()

  const products = await Product.findAll( {where: {sku: wanted}, attributes: ['id', 'sku'], transaction} )


  return new Map( products.map( p => [p.sku.trim().toLowerCase(), p.id] ) )
}
