import { Op } from 'sequelize'

import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import StockItem from '@/db/models/StockItem'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Address from '@/db/models/Address'
import Person from '@/db/models/Person'
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import Shipment, { ShipmentLine } from '@/db/models/Shipment'
import sequelize from '@/db/sequelize'
import { makesPieces } from '@/libs/channelOrders/accept'
import { PHASE_ORDER } from '@/libs/pieceScheduling'
import { adjustStock } from '@/libs/stock'
import { CARRIER_MODES, SHIPMENT_STEPS, TRANSPORT_MODES } from '@/utils/shipments'

// Shipments: an Order's physical hand-offs - see CONTEXT.md's Shipment
// entry and docs/adr/0009. The rules kept here:
//
// - A Shipment carries some of its Order's products, never more of one
//   than the Order has left that isn't on another Shipment.
// - A built product (makesPieces()) ships as Pieces: the Shipment claims
//   that many of the Order's unclaimed Pieces, most advanced first, and
//   no more of them can be picked than are Ready. Any other product, when
//   its Stock is tracked, can't be picked beyond what's on hand.
// - Picking is done line by line (ShipmentLine.picked): each change takes
//   that much out of Stock (where tracked), or puts it back. Picking is
//   done - pickedAt set - exactly while every line is fully picked.
// - Its products can only change, and it can only be deleted, until it's
//   packed; whatever was picked of a product it no longer carries goes
//   back into Stock.
//
// Each runs in a transaction and throws an Error a person can read.

const what = product => product?.sku || product?.name || `Product #${product?.id}`

const mostAdvancedFirst = (a, b) => PHASE_ORDER.indexOf( b.phase ) - PHASE_ORDER.indexOf( a.phase ) || a.id - b.id

const blank = value => (typeof value === 'string' ? value.trim() : value) || null

async function lockShipment( id, transaction )
{
  const shipment = await Shipment.findByPk( id, {transaction, lock: transaction.LOCK.UPDATE} )

  if( !shipment )
    throw new Error( 'That shipment no longer exists' )

  return shipment
}

// The Order's lines, productId -> {product, quantity} (duplicate rows summed).
async function orderLines( orderId, transaction )
{
  const rows = await OrderProduct.findAll( {where: {orderId}, transaction} )
  const products = rows.length ? await Product.findAll( {where: {id: rows.map( r => r.productId )}, transaction} ) : []
  const byId = new Map( products.map( p => [p.id, p] ) )
  const lines = new Map()

  for( const row of rows )
  {
    const line = lines.get( row.productId ) ?? {product: byId.get( row.productId ), quantity: 0}

    line.quantity += Number( row.quantity ?? 0 )
    lines.set( row.productId, line )
  }

  return lines
}

// How much of each product is already on the Order's Shipments,
// productId -> quantity.
export async function allocatedByProduct( orderId, transaction )
{
  const rows = await ShipmentLine.findAll( {
    include: {model: Shipment, where: {orderId}, attributes: []},
    attributes: ['productId', 'quantity'],
    transaction,
  } )

  const allocated = new Map()

  for( const row of rows )
    allocated.set( row.productId, (allocated.get( row.productId ) ?? 0) + Number( row.quantity ) )

  return allocated
}

// `requested` ([{productId, quantity}]) checked against the Order:
// each on it, positive, whole for a built product, and no more than is
// left off other Shipments. -> [{product, quantity}] (zeros dropped).
async function checkLines( orderId, requested, transaction )
{
  const lines = await orderLines( orderId, transaction )
  const allocated = await allocatedByProduct( orderId, transaction )
  const checked = []

  for( const r of requested ?? [] )
  {
    const quantity = Number( r.quantity )
    const line = lines.get( Number( r.productId ) )

    if( !quantity )
      continue

    if( !line )
      throw new Error( 'That product isn\'t on this order' )

    if( !Number.isFinite( quantity ) || quantity < 0 )
      throw new Error( `${what( line.product )}: quantity must be greater than 0` )

    if( makesPieces( line.product ) && !Number.isInteger( quantity ) )
      throw new Error( `${what( line.product )}: a production item ships in whole units` )

    const left = line.quantity - (allocated.get( line.product.id ) ?? 0)

    if( quantity > left )
      throw new Error( `${what( line.product )}: only ${left} left to ship` )

    checked.push( {product: line.product, quantity} )
  }

  if( !checked.length )
    throw new Error( 'Choose something to ship' )

  return checked
}

// Stores the lines, claiming Pieces for the built products.
async function addLines( shipment, lines, transaction )
{
  for( const {product, quantity} of lines )
  {
    await ShipmentLine.create( {shipmentId: shipment.id, productId: product.id, quantity}, {transaction} )

    if( !makesPieces( product ) )
      continue

    const pieces = await Piece.findAll( {where: {orderId: shipment.orderId, productId: product.id, shipmentId: null}, transaction} )

    if( pieces.length < quantity )
      throw new Error( `${what( product )}: only ${pieces.length} unclaimed pieces on this order` )

    const claiming = pieces.sort( mostAdvancedFirst ).slice( 0, quantity ).map( p => p.id )

    await Piece.update( {shipmentId: shipment.id}, {where: {id: claiming}, transaction} )
  }
}

async function releaseLines( shipment, transaction )
{
  await Piece.update( {shipmentId: null}, {where: {shipmentId: shipment.id}, transaction} )
  await ShipmentLine.destroy( {where: {shipmentId: shipment.id}, transaction} )
}

// The editable details, checked: only the keys present in `fields`.
function details( fields )
{
  const out = {}

  if( 'transportMode' in fields )
  {
    const mode = blank( fields.transportMode )

    if( mode && !TRANSPORT_MODES.includes( mode ) )
      throw new Error( `Unknown transport mode "${mode}"` )

    out.transportMode = mode
  }

  for( const key of ['carrier', 'service', 'tracking', 'notes'] )
    if( key in fields )
      out[key] = blank( fields[key] )

  if( 'shipTo' in fields )
  {
    const shipTo = fields.shipTo && Object.fromEntries( Object.entries( fields.shipTo ).map( ([k, v]) => [k, blank( v )] ) )

    out.shipTo = shipTo && Object.values( shipTo ).some( Boolean ) ? shipTo : null
  }

  return out
}

const CARRIER = /^(USPS|UPS|FedEx|DHL)\b/i

// A new Shipment's starting details: the ship-to and shipping method of
// a Channel Order it came from, else the customer's address.
async function defaults( order, transaction )
{
  const links = await ChannelOrderOrder.findAll( {where: {orderId: order.id}, transaction} )

  const channelOrders = links.length
    ? await ChannelOrder.findAll( {where: {id: links.map( l => l.channelOrderId )}, order: [['id', 'ASC']], transaction} )
    : []

  const method = channelOrders.map( c => c.shippingMethod ).find( Boolean ) ?? null
  const shipTo = channelOrders.map( c => c.shipTo ).find( Boolean )

  if( shipTo )
    return {shipTo, service: method, carrier: method?.match( CARRIER )?.[1] ?? null}

  const customer = order.customerId ? await Person.findByPk( order.customerId, {include: [Address], transaction} ) : null
  const home = customer?.Address

  const address = customer && {
    name: [customer.firstName, customer.lastName].filter( Boolean ).join( ' ' ) || null,
    company: customer.company,
    street1: home?.street1 ?? null,
    street2: home?.street2 ?? null,
    city: home?.city ?? null,
    state: home?.state ?? null,
    postalCode: home?.postalCode ?? null,
    country: home?.country ?? null,
    phone: customer.phone,
    email: customer.email,
  }

  return {shipTo: address && [address.street1, address.city].some( Boolean ) ? address : null, service: method, carrier: method?.match( CARRIER )?.[1] ?? null}
}

// `fields`: {lines: [{productId, quantity}], transportMode, carrier,
// service, tracking, shipTo, notes} - details left out are filled from
// defaults(). -> the new Shipment's id.
export async function createShipment( orderId, fields )
{
  return sequelize.transaction( async transaction => {
    const order = await Order.findByPk( orderId, {transaction, lock: transaction.LOCK.UPDATE} )

    if( !order )
      throw new Error( `No such order #${orderId}` )

    const {lines: requested, ...rest} = fields
    const lines = await checkLines( order.id, requested, transaction )

    const shipment = await Shipment.create( {
      orderId: order.id,
      ...await defaults( order, transaction ),
      ...details( rest ),
      createdOn: new Date(),
    }, {transaction} )

    await addLines( shipment, lines, transaction )

    return shipment.id
  } )
}

// Sets pickedAt exactly while every line is fully picked.
async function syncPicked( shipment, transaction )
{
  const lines = await ShipmentLine.findAll( {where: {shipmentId: shipment.id}, transaction} )
  const done = lines.length > 0 && lines.every( l => Number( l.picked ) >= Number( l.quantity ) )

  if( done && !shipment.pickedAt )
    await shipment.update( {pickedAt: new Date()}, {transaction} )
  else if( !done && shipment.pickedAt )
    await shipment.update( {pickedAt: null}, {transaction} )
}

// How many of a built line's claimed Pieces are Ready.
async function readyPieces( shipmentId, productId, transaction )
{
  return Piece.count( {where: {shipmentId, productId, phase: 'Ready'}, transaction} )
}

// Changes a Shipment's details, and its products when `fields.lines` is
// given (only until it's packed). What was picked of a product it still
// carries stays picked (up to its new quantity, and the Pieces Ready);
// anything picked beyond that goes back into Stock.
export async function updateShipment( id, fields )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const {lines, ...rest} = fields

    if( lines !== undefined )
    {
      if( shipment.packedAt )
        throw new Error( 'Its products can\'t change once it\'s packed - undo Packing first' )

      await Order.findByPk( shipment.orderId, {transaction, lock: transaction.LOCK.UPDATE} )

      const before = await ShipmentLine.findAll( {where: {shipmentId: id}, transaction} )
      const pickedBefore = new Map( before.map( l => [l.productId, Number( l.picked )] ) )

      await releaseLines( shipment, transaction )
      await addLines( shipment, await checkLines( shipment.orderId, lines, transaction ), transaction )

      for( const line of await ShipmentLine.findAll( {where: {shipmentId: id}, include: Product, transaction} ) )
      {
        const had = pickedBefore.get( line.productId ) ?? 0
        const cap = makesPieces( line.Product ) ? await readyPieces( id, line.productId, transaction ) : Infinity
        const keep = Math.min( had, Number( line.quantity ), cap )

        pickedBefore.delete( line.productId )

        if( keep )
          await line.update( {picked: keep}, {transaction} )

        if( had > keep )
          await adjustStock( line.productId, had - keep, transaction )
      }

      // Products it no longer carries: whatever was picked goes back
      for( const [productId, had] of pickedBefore )
        if( had )
          await adjustStock( productId, had, transaction )

      await syncPicked( shipment, transaction )
    }

    await shipment.update( details( rest ), {transaction} )
  } )
}

// Only until it's packed; anything picked goes back into Stock.
export async function deleteShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )

    if( shipment.packedAt )
      throw new Error( 'A packed shipment can\'t be deleted - undo Packing first' )

    for( const line of await ShipmentLine.findAll( {where: {shipmentId: id}, transaction} ) )
      if( Number( line.picked ) )
        await adjustStock( line.productId, Number( line.picked ), transaction )

    await releaseLines( shipment, transaction )
    await shipment.destroy( {transaction} )
  } )
}

// Sets how much of one Shipment line has been picked (0 to its
// quantity; for a built product, no more than its Pieces that are Ready;
// for a tracked one, no more than is on hand), moving the difference out
// of or back into Stock. Only until the Shipment is packed.
// -> {picked, step}
export async function setLinePicked( lineId, picked )
{
  return sequelize.transaction( async transaction => {
    const line = await ShipmentLine.findByPk( lineId, {include: Product, transaction} )

    if( !line )
      throw new Error( 'That shipment line no longer exists' )

    const shipment = await lockShipment( line.shipmentId, transaction )

    if( shipment.packedAt )
      throw new Error( 'It\'s already packed - undo Packing to change what was picked' )

    const quantity = Number( line.quantity )
    const n = Number( picked )

    if( picked === '' || picked == null || !Number.isFinite( n ) || n < 0 || n > quantity )
      throw new Error( `${what( line.Product )}: picked must be 0 to ${quantity}` )

    if( makesPieces( line.Product ) )
    {
      if( !Number.isInteger( n ) )
        throw new Error( `${what( line.Product )}: pieces are picked whole` )

      const ready = await readyPieces( shipment.id, line.productId, transaction )

      if( n > ready )
        throw new Error( `${what( line.Product )}: only ${ready} of its pieces ${ready === 1 ? 'is' : 'are'} Ready` )
    }

    const delta = n - Number( line.picked )

    // What's on hand already excludes what this line picked before
    if( delta > 0 && !makesPieces( line.Product ) )
    {
      const stock = await StockItem.findOne( {where: {productId: line.productId}, transaction, lock: transaction.LOCK.UPDATE} )
      const onHand = stock ? Math.max( 0, Number( stock.quantity ) ) : Infinity

      if( delta > onHand )
        throw new Error( onHand
          ? `${what( line.Product )}: only ${onHand} more in stock - ${Number( line.picked ) + onHand} can be picked`
          : `${what( line.Product )}: none in stock` )
    }

    if( delta )
    {
      await adjustStock( line.productId, -delta, transaction )
      await line.update( {picked: n}, {transaction} )
    }

    await syncPicked( shipment, transaction )

    return {picked: n, step: shipment.pickedAt ? 'Packing' : 'Picking'}
  } )
}

// Marks the Shipment's current step done - not Picking, which is done
// line by line (setLinePicked()). Paperwork needs a transport mode (and a
// carrier, for the carrier modes). -> the step done.
export async function advanceShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const next = SHIPMENT_STEPS.find( s => !shipment[s.doneAt] )

    if( !next )
      throw new Error( 'This shipment has already been handed off' )

    if( next.step === 'Picking' )
      throw new Error( 'Check off its products as they\'re picked' )

    if( next.step === 'Paperwork' )
    {
      if( !shipment.transportMode )
        throw new Error( 'Choose how it travels first' )

      if( CARRIER_MODES.has( shipment.transportMode ) && !shipment.carrier )
        throw new Error( 'Enter the carrier first' )
    }

    await shipment.update( {[next.doneAt]: new Date()}, {transaction} )

    return next.step
  } )
}

// Undoes the Shipment's last step done - back to Packing at most; to
// un-pick, uncheck its products. -> the step undone.
export async function revertShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const last = SHIPMENT_STEPS.filter( s => shipment[s.doneAt] ).at( -1 )

    if( !last || last.step === 'Picking' )
      throw new Error( 'Nothing to undo - uncheck its products to un-pick them' )

    await shipment.update( {[last.doneAt]: null}, {transaction} )

    return last.step
  } )
}

// Pieces claimed by a Shipment line that's been at least partly picked -
// picking doesn't say which of its Pieces left the shelf, so none of them
// can step back out of Ready until that line is un-picked.
export async function pickedPieceIds( pieceIds, transaction )
{
  const pieces = await Piece.findAll( {where: {id: pieceIds, shipmentId: {[Op.ne]: null}}, attributes: ['id', 'shipmentId', 'productId'], transaction} )

  if( !pieces.length )
    return new Set()

  const lines = await ShipmentLine.findAll( {
    where: {shipmentId: [...new Set( pieces.map( p => p.shipmentId ) )], picked: {[Op.gt]: 0}},
    attributes: ['shipmentId', 'productId'],
    transaction,
  } )

  const picked = new Set( lines.map( l => `${l.shipmentId}:${l.productId}` ) )

  return new Set( pieces.filter( p => picked.has( `${p.shipmentId}:${p.productId}` ) ).map( p => p.id ) )
}
