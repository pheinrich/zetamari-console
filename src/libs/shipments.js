import { Op } from 'sequelize'

import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
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
//   can't finish Picking until they're all Ready.
// - Finishing Picking takes each product out of Stock (where tracked);
//   undoing it puts it back.
// - Its products can only change, and it can only be deleted, while
//   it's still at Picking.
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

  const customer = order.customerId ? await Person.findByPk( order.customerId, {transaction} ) : null

  const address = customer && {
    name: [customer.firstName, customer.lastName].filter( Boolean ).join( ' ' ) || null,
    company: customer.company,
    street1: customer.street1,
    street2: customer.street2,
    city: customer.city,
    state: customer.state,
    postalCode: customer.postalCode,
    country: customer.country,
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

// Changes a Shipment's details, and its products when `fields.lines` is
// given (only while still at Picking).
export async function updateShipment( id, fields )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const {lines, ...rest} = fields

    if( lines !== undefined )
    {
      if( shipment.pickedAt )
        throw new Error( 'Its products can\'t change once it\'s been picked - move it back to Picking first' )

      await Order.findByPk( shipment.orderId, {transaction, lock: transaction.LOCK.UPDATE} )
      await releaseLines( shipment, transaction )
      await addLines( shipment, await checkLines( shipment.orderId, lines, transaction ), transaction )
    }

    await shipment.update( details( rest ), {transaction} )
  } )
}

export async function deleteShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )

    if( shipment.pickedAt )
      throw new Error( 'Only a shipment still at Picking can be deleted - move it back first' )

    await releaseLines( shipment, transaction )
    await shipment.destroy( {transaction} )
  } )
}

// Marks the Shipment's current step done. Picking needs every claimed
// Piece Ready, and takes its products out of Stock; Paperwork needs a
// transport mode (and a carrier, for the carrier modes). -> the step done.
export async function advanceShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const next = SHIPMENT_STEPS.find( s => !shipment[s.doneAt] )

    if( !next )
      throw new Error( 'This shipment has already been handed off' )

    if( next.step === 'Picking' )
    {
      const lines = await ShipmentLine.findAll( {where: {shipmentId: id}, include: Product, transaction} )

      if( !lines.length )
        throw new Error( 'Add something to ship first' )

      for( const line of lines.filter( l => makesPieces( l.Product ) ) )
      {
        const pieces = await Piece.findAll( {where: {shipmentId: id, productId: line.productId}, transaction} )
        const waiting = pieces.filter( p => p.phase !== 'Ready' ).length

        if( pieces.length < Number( line.quantity ) )
          throw new Error( `${what( line.Product )}: ${Number( line.quantity ) - pieces.length} of its pieces are missing - edit the shipment to claim them again` )

        if( waiting )
          throw new Error( `${what( line.Product )}: ${waiting} of its pieces ${waiting === 1 ? 'isn\'t' : 'aren\'t'} Ready yet` )
      }

      for( const line of lines )
        await adjustStock( line.productId, -Number( line.quantity ), transaction )
    }

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

// Undoes the Shipment's last step done; undoing Picking puts its
// products back in Stock. -> the step undone.
export async function revertShipment( id )
{
  return sequelize.transaction( async transaction => {
    const shipment = await lockShipment( id, transaction )
    const last = SHIPMENT_STEPS.filter( s => shipment[s.doneAt] ).at( -1 )

    if( !last )
      throw new Error( 'Nothing to undo - it\'s still at Picking' )

    if( last.step === 'Picking' )
      for( const line of await ShipmentLine.findAll( {where: {shipmentId: id}, transaction} ) )
        await adjustStock( line.productId, Number( line.quantity ), transaction )

    await shipment.update( {[last.doneAt]: null}, {transaction} )

    return last.step
  } )
}

// Pieces claimed by a Shipment past Picking - they've left the shelf, so
// their phase and Order are settled.
export async function pickedPieceIds( pieceIds, transaction )
{
  const pieces = await Piece.findAll( {
    where: {id: pieceIds, shipmentId: {[Op.ne]: null}},
    include: {model: Shipment, where: {pickedAt: {[Op.ne]: null}}, attributes: []},
    attributes: ['id'],
    transaction,
  } )

  return new Set( pieces.map( p => p.id ) )
}
