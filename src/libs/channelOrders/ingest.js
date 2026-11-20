import { createHash } from 'crypto'

import PostalMime from 'postal-mime'
import { Op } from 'sequelize'

import ChannelOrder from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import InboundEmail from '@/db/models/InboundEmail'
import sequelize from '@/db/sequelize'
import { parseOrderEmail } from '@/libs/channelOrders'
import { fetchEtsyReceipt, withEtsyReceipt } from '@/libs/channelOrders/etsyApi'
import { fetchFaireOrder, withFaireApiOrder } from '@/libs/channelOrders/faireApi'
import { readForward } from '@/libs/channelOrders/forwarded'
import { matchSkus } from '@/libs/channelOrders/matching'

// Channels whose emails are completed from their own API: Faire's email
// lists only some lines, Etsy's lines carry no SKUs. `fetch` takes the
// email's order number; `apply` folds the result into the order.
const API_COMPLETION = {
  faire: {label: 'Faire API', fetch: fetchFaireOrder, apply: withFaireApiOrder},
  etsy: {label: 'Etsy API', fetch: fetchEtsyReceipt, apply: withEtsyReceipt},
}

// Stores a raw RFC 5322 email (Buffer/string) as an InboundEmail, then
// processes it. Idempotent on Message-ID: redelivering an email that
// already parsed is a no-op, while one that previously failed is
// re-processed (so a sender's retry after a parser fix just works).
// `force` reprocesses even one that parsed (see processInboundEmail()).
export async function ingestRawEmail( raw, {force = false} = {} )
{
  await sequelize.sync()

  const bytes = Buffer.isBuffer( raw ) ? raw : Buffer.from( raw )
  const email = await PostalMime.parse( bytes )
  const messageId = email.messageId || `sha256:${createHash( 'sha256' ).update( bytes ).digest( 'hex' )}`

  let inbound = await InboundEmail.findOne( {where: {messageId}} )

  if( inbound && inbound.status !== 'failed' && !force )
    return {inboundEmailId: inbound.id, status: inbound.status, duplicate: true, channelOrderId: inbound.channelOrderId}

  inbound ??= await InboundEmail.create( {
    messageId,
    fromAddress: email.from?.address ?? null,
    subject: email.subject?.slice( 0, 1024 ) ?? null,
    sentAt: email.date ? new Date( email.date ) : null,
    raw: bytes,
  } )

  return processInboundEmail( inbound, email, {force} )
}

// Classifies + parses one stored InboundEmail and upserts its Channel
// Order. Separate from ingestRawEmail() so stored mail can be replayed
// (`email` is the already-parsed MIME, re-derived from `raw` if absent).
// `force` is a person's explicit "reparse": the email's lines replace
// the order's even if there are fewer of them (see upsertChannelOrder()).
export async function processInboundEmail( inbound, email = null, {force = false} = {} )
{
  email ??= await PostalMime.parse( inbound.raw )

  // Forwarded by hand (see forwarded.js): attached emails are each
  // ingested as their own InboundEmail; an inline forward is parsed as
  // the email it quotes.
  const forward = await readForward( inbound.raw, email )

  if( forward?.error )
  {
    await inbound.update( {channel: null, kind: 'forward', status: 'failed', error: forward.error, channelOrderId: null} )

    return {inboundEmailId: inbound.id, status: 'failed', kind: 'forward', error: forward.error}
  }

  if( forward?.messages )
    return processForwardedMessages( inbound, forward.messages, force )

  const source = forward?.inline ?? {from: email.from?.address, subject: email.subject, html: email.html, text: email.text, date: email.date}
  let parsed

  try
  {
    parsed = parseOrderEmail( source )
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

  // Complete the order from the channel's API where there is one. If
  // that fails the email's own lines are staged and the reason kept on
  // the email - still 'parsed', since the email was.
  let apiError = null
  const completion = API_COMPLETION[channel]

  if( completion )
  {
    try
    {
      order = completion.apply( order, await completion.fetch( order.externalOrderId ) )
    }
    catch( error )
    {
      apiError = `${completion.label}: ${error.message}`
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

// A forward carrying emails as attachments: each is ingested as if it had
// arrived on its own (deduplicated on its own Message-ID, so one already
// received is left alone unless `force`d). The forward itself records
// the outcome - 'parsed' when every attachment was stored and processed,
// 'failed' with the reasons otherwise.
async function processForwardedMessages( inbound, messages, force )
{
  const results = []

  for( const raw of messages )
  {
    try
    {
      results.push( await ingestRawEmail( raw, {force} ) )
    }
    catch( error )
    {
      results.push( {status: 'failed', error: error.message} )
    }
  }

  const failures = results.filter( r => r.status === 'failed' )

  const error = failures.length
    ? `${failures.length} of ${results.length} forwarded emails failed: ${failures.map( f => f.error ).join( '; ' )}`
    : null

  await inbound.update( {channel: null, kind: 'forward', status: failures.length ? 'failed' : 'parsed', error, channelOrderId: null} )

  return {inboundEmailId: inbound.id, status: failures.length ? 'failed' : 'parsed', kind: 'forward', forwarded: results, ...(error && {error})}
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
// by exact SKU or a Product Alias (see matching.js).
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

// Re-fetches a stored Channel Order from its channel's API (Faire or
// Etsy), replacing its lines and, for Faire, amounts - for orders staged
// before the API was used, or when it was unreachable at intake. Only
// while the order is still 'new'. Clears that API's earlier error from
// the order's emails once it works.
export async function refreshChannelOrderFromApi( channelOrder )
{
  const completion = API_COMPLETION[channelOrder.channel]

  if( !completion )
    throw new Error( `No API to fetch ${channelOrder.channel} orders from` )

  if( channelOrder.status !== 'new' )
    throw new Error( `This order is ${channelOrder.status} - restore it to new first` )

  const order = completion.apply( channelOrder.toJSON(), await completion.fetch( channelOrder.externalOrderId ) )

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
      {where: {channelOrderId: channelOrder.id, error: {[Op.startsWith]: `${completion.label}:`}}, transaction}
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
