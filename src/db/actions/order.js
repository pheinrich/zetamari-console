'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Customer from '@/db/models/Customer'
import GroutingDay from '@/db/models/GroutingDay'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { ensureProjectionsFresh, markAllOrdersScheduleStale, markOrdersScheduleStale } from '@/db/actions/scheduling'

// `lines` is [{productId, quantity}, ...] from the intake form's
// repeatable rows. Spawns one Piece per unit of quantity, phase
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

// Edits Customer/Promised Date only - not line items. Once an Order's
// Pieces exist (and may already be mid-phase), changing quantities/
// products would mean adding/removing/reassigning Pieces with
// production progress, which needs its own design pass; this is
// intentionally the smaller, safe subset for now. Clearing
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

// Pieces has no onDelete: CASCADE on its orderId FK (unlike
// OrderProducts, which does), so those have to be removed by hand
// before the Order itself can be destroyed.
export async function deleteOrder( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const order = await Order.findByPk( id )
  if( !order )
    notFound()

  await sequelize.transaction( async t => {
    await Piece.destroy( {where: {orderId: id}, transaction: t} )
    await order.destroy( {transaction: t} )
  } )

  // Freed Capacity/a freed Grouting Day slot can change other orders'
  // projections too.
  await markAllOrdersScheduleStale()

  return {success: true}
}

// isAtRisk is derived, not stored - CONTEXT.md's Projected Completion
// Date entry defines "at risk" as simply projectedCompletionDate
// landing after promisedDate, no buffer.
function withAtRisk( orderJson )
{
  const isAtRisk = !!(orderJson.projectedCompletionDate && orderJson.promisedDate
    && orderJson.projectedCompletionDate > orderJson.promisedDate)

  return {...orderJson, isAtRisk}
}

export async function readOrder( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  await ensureProjectionsFresh()

  const order = await Order.findByPk( id, {include: [Customer, GroutingDay]} )
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
  const lines = orderProducts.map( l => ({...l.toJSON(), Product: productById[l.productId]}) )

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

  return {
    ...withAtRisk( order.toJSON() ),
    itemCount: lines.length,
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
  await ensureProjectionsFresh()

  const orders = await Order.findAll( {include: [Customer, GroutingDay], order: [['createdOn', 'DESC']]} )
  if( 0 === orders.length )
    return []

  // COUNT(orderId), not COUNT(id) - OrderProduct has no id column (see
  // its model's doc comment). orderId is NOT NULL, so this counts rows
  // per group exactly the same way.
  const counts = await OrderProduct.findAll( {
    where: {orderId: orders.map( o => o.id )},
    attributes: ['orderId', [Sequelize.fn( 'COUNT', Sequelize.col( 'orderId' ) ), 'count']],
    group: ['orderId'],
  } )

  const countByOrderId = {}
  for( const c of counts )
    countByOrderId[c.orderId] = Number( c.get( 'count' ) )

  return orders.map( o => withAtRisk( {...o.toJSON(), itemCount: countByOrderId[o.id] || 0} ) )
}
