'use server'

import { notFound, unauthorized } from 'next/navigation'

import { Op, Sequelize } from 'sequelize'

import Person from '@/db/models/Person'
import GroutingDay from '@/db/models/GroutingDay'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Piece from '@/db/models/Piece'
import ChannelOrder from '@/db/models/ChannelOrder'
import Product from '@/db/models/Product'
import Shipment, { ShipmentLine } from '@/db/models/Shipment'
import { makesPieces } from '@/libs/channelOrders/accept'
import * as orderLines from '@/libs/orderLines'
import { orderShipDate } from '@/utils/shipDate'
import { orderFulfillment, shipmentStep } from '@/utils/shipments'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markAllOrdersScheduleStale, markOrdersScheduleStale } from '@/db/actions/scheduling'

// `lines` is [{productId, quantity}, ...] from the intake form's
// repeatable rows. Spawns one Piece per unit of quantity of each
// production item (makesPieces() - finished goods and kits), phase
// 'Design', auto-generated 1:1 with the OrderProduct line rather than a
// separate staff-triggered step - Piece rows are what scheduling
// actually operates on from here on; OrderProduct.quantity stays the
// nominal figure entered here (see Piece.js's doc comment). If
// `promisedDate` is supplied, that's an Explicit customer request
// (CONTEXT.md's Promised Date) and is fixed immediately; otherwise both
// promisedDate/promisedDateOrigin are left null for the recalculation
// engine to fill in as Computed on the next read.
export async function createOrder( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    const order = await sequelize.transaction( async t => {
      const order = await Order.create( {
        customerId: data.customerId,
        promisedDate: data.promisedDate || null,
        promisedDateOrigin: data.promisedDate ? 'explicit' : null,
      }, {transaction: t} )

      for( const line of data.lines || [] )
      {
        const quantity = Number( line.quantity ) || 0

        if( quantity <= 0 )
          continue

        await OrderProduct.create( {orderId: order.id, productId: line.productId, quantity}, {transaction: t} )

        if( !makesPieces( await Product.findByPk( line.productId, {attributes: ['id', 'type'], transaction: t} ) ) )
          continue

        const pieces = Array.from( {length: quantity}, () => ({orderId: order.id, productId: line.productId, phase: 'Design'}) )

        await Piece.bulkCreate( pieces, {transaction: t} )
      }

      return order
    } )

    await markOrdersScheduleStale( [order.id] )

    return {success: true, id: order.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( e => e.message ).join( '; ' )

      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while creating the order'}
  }
}

// Edits Customer/Promised Date only - line items are edited in place on
// the Order page (setOrderLineQuantity() and friends below). Clearing
// promisedDate resets promisedDateOrigin to null too, same as leaving
// it blank at intake - the engine recomputes it as Computed on next
// read.
export async function updateOrder( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const order = await Order.findByPk( data.id )

  if( !order )
    notFound()

  try
  {
    await order.update( {
      customerId: data.customerId,
      promisedDate: data.promisedDate || null,
      promisedDateOrigin: data.promisedDate ? 'explicit' : null,
    } )

    // A Promised Date edit can shift priority ordering (Explicit vs
    // Computed) for every order competing for the same Capacity/
    // Grouting Day, not just this one - see markAllOrdersScheduleStale()'s
    // doc comment.
    await markAllOrdersScheduleStale()

    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( e => e.message ).join( '; ' )

      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while updating the order'}
  }
}

// Pieces has no onDelete: CASCADE on its orderId FK, so they're removed
// by hand (libs/orderLines.js's deleteOrders()). A Channel Order left
// with no Order returns to 'new'.
export async function deleteOrder( id )
{
  return deleteOrders( [id] )
}

export async function deleteOrders( ids )
{
  return run( async () => {
    await orderLines.deleteOrders( ids )

    // Freed Capacity/a freed Grouting Day slot can change other orders'
    // projections too.
    await markAllOrdersScheduleStale()
  } )
}

// --- Changing an Order's lines (see libs/orderLines.js) ---

// Each returns {success: true, ...} or {error} - never throws to the page.
async function run( work )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    return {success: true, ...await work()}
  }
  catch( error )
  {
    return {error: error.message || 'Something went wrong'}
  }
}

export async function setOrderLineQuantity( orderId, productId, quantity )
{
  return run( async () => {
    await orderLines.setOrderLineQuantity( orderId, productId, quantity )
    await markOrdersScheduleStale( [orderId] )
  } )
}

export async function removeOrderLines( orderId, productIds )
{
  return run( async () => {
    await orderLines.removeOrderLines( orderId, productIds )
    await markOrdersScheduleStale( [orderId] )
  } )
}

export async function addOrderLine( orderId, productId, quantity )
{
  return run( async () => {
    await orderLines.addOrderLine( orderId, productId, quantity )
    await markOrdersScheduleStale( [orderId] )
  } )
}

// moves: [{productId, quantity}] -> {orderId} of the new Order
export async function splitOrder( orderId, moves )
{
  return run( async () => {
    const newId = await orderLines.splitOrder( orderId, moves )

    await markOrdersScheduleStale( [orderId, newId] )

    return {orderId: newId}
  } )
}

// -> {orderId} of the surviving (oldest) Order
export async function combineOrders( orderIds )
{
  return run( async () => ({orderId: await orderLines.combineOrders( orderIds )}) )
}

// Every Product, just enough to pick one to add to an Order.
export async function readOrderProductOptions()
{
  const session = await auth()

  if( !session )
    unauthorized()

  const products = await Product.findAll( {attributes: ['id', 'sku', 'name', 'status', 'type', 'units'], order: [['sku', 'ASC']]} )

  return products.map( p => ({...p.toJSON(), makesPieces: makesPieces( p )}) )
}

// isAtRisk is derived, not stored - CONTEXT.md's Projected Completion
// Date entry defines "at risk" as simply projectedCompletionDate
// landing after promisedDate, no buffer.
function withAtRisk( orderJson )
{
  const isAtRisk = !!(orderJson.projectedCompletionDate && orderJson.promisedDate
    && orderJson.projectedCompletionDate > orderJson.promisedDate)

  const ship = orderShipDate( orderJson )

  return {...orderJson, isAtRisk, shipDate: ship.date, shipDateOrigin: ship.origin}
}

// Each Order's Shipments (with their lines and products) and the
// fulfillment derived from them - see utils/shipments.js's
// orderFulfillment(). -> orderId -> {shipments, fulfillment}
async function fulfillmentByOrderId( orderIds )
{
  const [shipments, lines] = await Promise.all( [
    Shipment.findAll( {
      where: {orderId: orderIds},
      include: {model: ShipmentLine, as: 'Lines', include: {model: Product, attributes: ['id', 'sku', 'name', 'type', 'units']}},
      order: [['id', 'ASC']],
    } ),
    OrderProduct.findAll( {where: {orderId: orderIds}, attributes: ['orderId', 'productId', 'quantity']} ),
  ] )

  const result = Object.fromEntries( orderIds.map( id => [id, {shipments: [], lines: []}] ) )

  for( const s of shipments )
    result[s.orderId]?.shipments.push( {...s.toJSON(), step: shipmentStep( s )} )

  for( const l of lines )
    result[l.orderId]?.lines.push( l.toJSON() )

  for( const entry of Object.values( result ) )
    entry.fulfillment = orderFulfillment( entry.lines, entry.shipments )

  return result
}

export async function readOrder( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const order = await Order.findByPk( id, {include: [
    {model: Person, as: 'Customer'},
    GroutingDay,
    {model: ChannelOrder, attributes: ['id', 'channel', 'externalOrderId', 'shippingMethod'], through: {attributes: []}},   // accepted from - several once combined
  ]} )

  if( !order )
    notFound()

  // No OrderProduct.belongsTo(Product) association exists - joined by
  // hand instead, same "don't rely on default association aliasing"
  // approach customer.js's readCustomerOrders() already uses for this
  // exact table.
  const orderProducts = await OrderProduct.findAll( {where: {orderId: id}} )

  const products = orderProducts.length
    ? await Product.findAll( {where: {id: orderProducts.map( l => l.productId )}} )
    : []

  const productById = Object.fromEntries( products.map( p => [p.id, p.toJSON()] ) )
  const lines = orderProducts.map( l => ({...l.toJSON(), Product: productById[l.productId], makesPieces: makesPieces( productById[l.productId] )}) )

  // Piece counts grouped by product + phase - shown per product line in
  // the Products table (a flat shop-wide phase count wasn't useful on
  // an order with more than one line item - which phase a count
  // belongs to only means something next to the product it's for).
  const pieceBreakdown = await Piece.findAll( {
    where: {orderId: id},
    attributes: ['productId', 'phase', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['productId', 'phase'],
  } )

  const phaseCountsByProductId = {}

  for( const row of pieceBreakdown )
    (phaseCountsByProductId[row.productId] ??= {})[row.phase] = Number( row.get( 'count' ) )

  // Each Shipment line's claimed Pieces that are Ready, for built products
  const {shipments, fulfillment} = (await fulfillmentByOrderId( [order.id] ))[order.id]

  const readyRows = await Piece.findAll( {
    where: {orderId: id, shipmentId: {[Op.ne]: null}, phase: 'Ready'},
    attributes: ['shipmentId', 'productId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['shipmentId', 'productId'],
  } )

  const readyCount = Object.fromEntries( readyRows.map( r => [`${r.shipmentId}:${r.productId}`, Number( r.get( 'count' ) )] ) )

  return {
    ...withAtRisk( order.toJSON() ),
    packedOn: fulfillment.packedOn,
    completedOn: fulfillment.completedOn,
    fulfillment,
    shipments: shipments.map( s => ({
      ...s,
      Lines: s.Lines.map( l => ({...l, quantity: Number( l.quantity ), makesPieces: makesPieces( l.Product ), ready: readyCount[`${s.id}:${l.productId}`] ?? 0}) ),
    }) ),
    itemCount: lines.length,
    unitCount: lines.reduce( (n, l) => n + Number( l.quantity ?? 0 ), 0 ),
    lines: lines.map( l => ({...l, phaseCounts: phaseCountsByProductId[l.productId] ?? {}}) ),
  }
}

// Same grouped-count pattern customer.js's readCustomerOrders()/
// readCustomers() already use for itemCount, rather than an eager
// include through the belongsToMany association.
export async function readOrders()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const orders = await Order.findAll( {
    include: [
      {model: Person, as: 'Customer'},
      GroutingDay,
      {model: ChannelOrder, attributes: ['id', 'channel', 'externalOrderId', 'shippingMethod'], through: {attributes: []}},
    ],
    order: [['createdOn', 'DESC']],
  } )

  if( 0 === orders.length )
    return []

  // COUNT(orderId), not COUNT(id) - OrderProduct has no id column (see
  // its model's doc comment). orderId is NOT NULL, so this counts rows
  // per group exactly the same way.
  const counts = await OrderProduct.findAll( {
    where: {orderId: orders.map( o => o.id )},
    attributes: [
      'orderId',
      [Sequelize.fn( 'COUNT', Sequelize.col( 'orderId' ) ), 'count'],
      [Sequelize.fn( 'SUM', Sequelize.col( 'quantity' ) ), 'units'],
    ],
    group: ['orderId'],
  } )

  const countByOrderId = {}
  const unitsByOrderId = {}

  for( const c of counts )
  {
    countByOrderId[c.orderId] = Number( c.get( 'count' ) )
    unitsByOrderId[c.orderId] = Number( c.get( 'units' ) )
  }

  const fulfillments = await fulfillmentByOrderId( orders.map( o => o.id ) )

  return orders.map( o => {
    const {fulfillment} = fulfillments[o.id]

    return withAtRisk( {
      ...o.toJSON(),
      itemCount: countByOrderId[o.id] || 0,
      unitCount: unitsByOrderId[o.id] || 0,
      packedOn: fulfillment.packedOn,
      completedOn: fulfillment.completedOn,
      fulfillmentStatus: fulfillment.status,
    } )
  } )
}
