import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize'
import { makesPieces } from '@/libs/channelOrders/accept'

// Changing an Order's lines after it exists: quantities, removing and
// adding products, splitting some of it off into a new Order, combining
// Orders, and deleting them. Each keeps an Order's Pieces in step with
// its lines - one Piece per unit of a production item (finished goods
// and kits - see makesPieces()), none for supplies and bases sold as-is.
// Each runs in its own transaction and throws an Error a person can read.

// CONTEXT.md's Production Phases in order - how far along a Piece is,
// whichever sequence (kit or finished) its product follows.
const PHASES = ['Design', 'CNC', 'Sanding', 'Assembly', 'Gluing', 'Grouting', 'Glass', 'Finishing']

const leastAdvancedFirst = (a, b) => PHASES.indexOf( a.phase ) - PHASES.indexOf( b.phase ) || b.id - a.id
const mostAdvancedFirst = (a, b) => -leastAdvancedFirst( a, b )

const what = product => product?.sku || product?.name || `Product #${product?.id}`

// A line's quantity, checked: positive, and whole for a production item.
function checkQuantity( product, quantity, {allowZero = false} = {} )
{
  const n = Number( quantity )

  if( !Number.isFinite( n ) || n < 0 || (!allowZero && n === 0) )
    throw new Error( `${what( product )}: quantity must be greater than 0` )

  if( makesPieces( product ) && !Number.isInteger( n ) )
    throw new Error( `${what( product )}: a production item needs a whole-number quantity` )

  return n
}

async function lockOrder( id, transaction )
{
  const order = await Order.findByPk( id, {transaction, lock: transaction.LOCK.UPDATE} )

  if( !order )
    throw new Error( `No such order #${id}` )

  return order
}

// The Order's lines as {product, quantity}, one per product (duplicate
// rows - possible from hand entry - are summed).
async function linesOf( orderId, transaction )
{
  const rows = await OrderProduct.findAll( {where: {orderId}, transaction} )
  const products = rows.length ? await Product.findAll( {where: {id: rows.map( r => r.productId )}, attributes: ['id', 'sku', 'name', 'type'], transaction} ) : []
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

// Sets one product's quantity on an Order (0 removes the line), adding
// Design-phase Pieces or removing the least advanced ones to match.
async function setLine( orderId, product, quantity, transaction )
{
  await OrderProduct.destroy( {where: {orderId, productId: product.id}, transaction} )

  if( quantity > 0 )
    await OrderProduct.create( {orderId, productId: product.id, quantity}, {transaction} )

  const pieces = await Piece.findAll( {where: {orderId, productId: product.id}, transaction} )
  const wanted = makesPieces( product ) ? quantity : 0

  if( pieces.length > wanted )
    await Piece.destroy( {where: {id: pieces.sort( leastAdvancedFirst ).slice( 0, pieces.length - wanted ).map( p => p.id )}, transaction} )
  else if( pieces.length < wanted )
    await Piece.bulkCreate( Array.from( {length: wanted - pieces.length}, () => ({orderId, productId: product.id, phase: 'Design'}) ), {transaction} )
}

export async function setOrderLineQuantity( orderId, productId, quantity )
{
  return sequelize.transaction( async transaction => {
    await lockOrder( orderId, transaction )

    const product = await Product.findByPk( productId, {transaction} )

    await setLine( orderId, product, checkQuantity( product, quantity ), transaction )
  } )
}

export async function removeOrderLines( orderId, productIds )
{
  return sequelize.transaction( async transaction => {
    await lockOrder( orderId, transaction )

    await OrderProduct.destroy( {where: {orderId, productId: productIds}, transaction} )
    await Piece.destroy( {where: {orderId, productId: productIds}, transaction} )
  } )
}

// Adds a product, or more of one already on the Order.
export async function addOrderLine( orderId, productId, quantity )
{
  return sequelize.transaction( async transaction => {
    await lockOrder( orderId, transaction )

    const product = await Product.findByPk( productId, {transaction} )

    if( !product )
      throw new Error( 'Choose a product' )

    const existing = (await linesOf( orderId, transaction )).get( product.id )?.quantity ?? 0

    await setLine( orderId, product, existing + checkQuantity( product, quantity ), transaction )
  } )
}

// Moves `moves` ([{productId, quantity}]) to a new Order with the same
// customer, dates and Channel Orders. Moved production items take their
// most advanced Pieces along (what's nearly done ships first). Something
// must move and something must stay, so an Order of a single unit can't
// be split. -> the new Order's id.
export async function splitOrder( orderId, moves )
{
  return sequelize.transaction( async transaction => {
    const order = await lockOrder( orderId, transaction )
    const lines = await linesOf( orderId, transaction )
    const units = [...lines.values()].reduce( (n, l) => n + l.quantity, 0 )

    if( units <= 1 )
      throw new Error( 'An order of a single item can\'t be split' )

    const moving = (moves ?? [])
      .map( m => ({line: lines.get( Number( m.productId ) ), quantity: Number( m.quantity )}) )
      .filter( m => m.quantity > 0 )

    for( const {line, quantity} of moving )
    {
      if( !line )
        throw new Error( 'That product isn\'t on this order' )

      checkQuantity( line.product, quantity )

      if( quantity > line.quantity )
        throw new Error( `${what( line.product )}: only ${line.quantity} on this order` )
    }

    const moved = moving.reduce( (n, m) => n + m.quantity, 0 )

    if( !moved )
      throw new Error( 'Choose something to move to the new order' )

    if( moved >= units )
      throw new Error( 'Leave something on this order - splitting off everything would just move it' )

    const created = await Order.create( {
      customerId: order.customerId,
      userId: order.userId,
      createdOn: order.createdOn,
      promisedDate: order.promisedDate,
      promisedDateOrigin: order.promisedDateOrigin,
      groutingDayId: order.groutingDayId,
    }, {transaction} )

    for( const {line, quantity} of moving )
    {
      const {product} = line

      await OrderProduct.destroy( {where: {orderId, productId: product.id}, transaction} )

      if( line.quantity - quantity > 0 )
        await OrderProduct.create( {orderId, productId: product.id, quantity: line.quantity - quantity}, {transaction} )

      await OrderProduct.create( {orderId: created.id, productId: product.id, quantity}, {transaction} )

      if( makesPieces( product ) )
      {
        const pieces = await Piece.findAll( {where: {orderId, productId: product.id}, transaction} )
        const taking = pieces.sort( mostAdvancedFirst ).slice( 0, quantity ).map( p => p.id )

        await Piece.update( {orderId: created.id}, {where: {id: taking}, transaction} )

        // An Order whose Pieces had drifted short of its quantity gets the rest new
        if( taking.length < quantity )
          await Piece.bulkCreate( Array.from( {length: quantity - taking.length}, () => ({orderId: created.id, productId: product.id, phase: 'Design'}) ), {transaction} )
      }
    }

    const links = await ChannelOrderOrder.findAll( {where: {orderId}, transaction} )

    await ChannelOrderOrder.bulkCreate( links.map( l => ({channelOrderId: l.channelOrderId, orderId: created.id}) ), {transaction} )

    return created.id
  } )
}

// Merges Orders of one customer into the oldest (lowest id): its lines
// summed per product, every Piece, Shipment and Channel Order moved to
// it; the earliest order date and earliest promised date kept. The
// others are deleted. -> the surviving Order's id.
export async function combineOrders( orderIds )
{
  const ids = [...new Set( (orderIds ?? []).map( Number ) )].sort( (a, b) => a - b )

  if( ids.length < 2 )
    throw new Error( 'Choose at least two orders to combine' )

  return sequelize.transaction( async transaction => {
    const orders = await Order.findAll( {where: {id: ids}, order: [['id', 'ASC']], transaction, lock: transaction.LOCK.UPDATE} )

    if( orders.length !== ids.length )
      throw new Error( 'Some of those orders no longer exist' )

    if( new Set( orders.map( o => o.customerId ) ).size > 1 )
      throw new Error( 'Only orders for the same customer can be combined' )

    const shipped = orders.filter( o => o.completedOn )

    if( shipped.length )
      throw new Error( `Order ${shipped.map( o => `#${o.id}` ).join( ', ' )} has already shipped` )

    const [survivor, ...others] = orders
    const otherIds = others.map( o => o.id )

    // Lines: sum per product across all of them, onto the survivor
    const totals = new Map()

    for( const order of orders )
      for( const [productId, line] of await linesOf( order.id, transaction ) )
        totals.set( productId, (totals.get( productId ) ?? 0) + line.quantity )

    await OrderProduct.destroy( {where: {orderId: ids}, transaction} )
    await OrderProduct.bulkCreate( [...totals].map( ([productId, quantity]) => ({orderId: survivor.id, productId, quantity}) ), {transaction} )

    await Piece.update( {orderId: survivor.id}, {where: {orderId: otherIds}, transaction} )
    await sequelize.query( 'UPDATE Shipments SET orderId = ? WHERE orderId IN (?)', {replacements: [survivor.id, otherIds], transaction} )

    // Channel Orders: each linked once to the survivor
    const links = await ChannelOrderOrder.findAll( {where: {orderId: ids}, transaction} )
    const channelOrderIds = [...new Set( links.map( l => l.channelOrderId ) )]

    await ChannelOrderOrder.destroy( {where: {orderId: ids}, transaction} )
    await ChannelOrderOrder.bulkCreate( channelOrderIds.map( channelOrderId => ({channelOrderId, orderId: survivor.id}) ), {transaction} )

    const earliest = key => orders.map( o => o[key] ).filter( Boolean ).sort()[0] ?? null
    const promised = orders.filter( o => o.promisedDate ).sort( (a, b) => a.promisedDate.localeCompare( b.promisedDate ) )[0]

    await survivor.update( {
      createdOn: earliest( 'createdOn' ),
      promisedDate: promised?.promisedDate ?? null,
      promisedDateOrigin: promised?.promisedDateOrigin ?? null,
      groutingDayId: survivor.groutingDayId ?? others.find( o => o.groutingDayId )?.groutingDayId ?? null,
      scheduleStale: true,
    }, {transaction} )

    await Order.destroy( {where: {id: otherIds}, transaction} )

    return survivor.id
  } )
}

// Deletes Orders with their lines and Pieces. A Channel Order left with
// no Order goes back to review ('new').
export async function deleteOrders( orderIds )
{
  const ids = [...new Set( (orderIds ?? []).map( Number ) )]

  if( !ids.length )
    return

  return sequelize.transaction( async transaction => {
    const links = await ChannelOrderOrder.findAll( {where: {orderId: ids}, transaction} )
    const channelOrderIds = [...new Set( links.map( l => l.channelOrderId ) )]

    await Piece.destroy( {where: {orderId: ids}, transaction} )
    await OrderProduct.destroy( {where: {orderId: ids}, transaction} )
    await ChannelOrderOrder.destroy( {where: {orderId: ids}, transaction} )
    await Order.destroy( {where: {id: ids}, transaction} )

    if( channelOrderIds.length )
    {
      const stillLinked = new Set( (await ChannelOrderOrder.findAll( {where: {channelOrderId: channelOrderIds}, transaction} )).map( l => l.channelOrderId ) )
      const orphaned = channelOrderIds.filter( id => !stillLinked.has( id ) )

      if( orphaned.length )
        await ChannelOrder.update( {status: 'new'}, {where: {id: orphaned, status: 'accepted'}, transaction} )
    }
  } )
}

