import { createHash } from 'crypto'

import PostalMime from 'postal-mime'

import ChannelOrder from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import InboundEmail from '@/db/models/InboundEmail'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { parseOrderEmail } from '@/libs/channelOrders'

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
export async function processInboundEmail( inbound, email = null )
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

  const {channel, kind, order} = parsed

  if( kind !== 'new-order' )
  {
    await inbound.update( {channel, kind, status: 'ignored', error: null} )

    return {inboundEmailId: inbound.id, status: 'ignored', channel, kind}
  }

  try
  {
    const channelOrder = await sequelize.transaction( t => upsertChannelOrder( order, t ) )

    await inbound.update( {channel, kind, status: 'parsed', error: null, channelOrderId: channelOrder.id} )

    return {inboundEmailId: inbound.id, status: 'parsed', channel, kind, channelOrderId: channelOrder.id}
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
// more fully; once accepted/dismissed it's left alone entirely.
async function upsertChannelOrder( order, transaction )
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
    return channelOrder

  const existingLines = channelOrder ? await ChannelOrderLine.count( {where: {channelOrderId: channelOrder.id}, transaction} ) : 0

  if( channelOrder && order.lines.length < existingLines )
    return channelOrder

  if( channelOrder )
    await channelOrder.update( fields, {transaction} )
  else
    channelOrder = await ChannelOrder.create( fields, {transaction} )

  const productIdBySku = await matchSkus( order.lines.map( l => l.sku ), transaction )

  await ChannelOrderLine.destroy( {where: {channelOrderId: channelOrder.id}, transaction} )
  await ChannelOrderLine.bulkCreate( order.lines.map( (line, position) => ({
    channelOrderId: channelOrder.id,
    position,
    sku: line.sku,
    description: line.description?.slice( 0, 1024 ) ?? null,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    productId: line.sku ? productIdBySku.get( line.sku.trim().toLowerCase() ) ?? null : null,
  }) ), {transaction} )

  return channelOrder
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
