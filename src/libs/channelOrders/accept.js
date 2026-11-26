import { Op } from 'sequelize'

import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import CustomerSource from '@/db/models/CustomerSource'
import LiveClass from '@/db/models/LiveClass'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Person from '@/db/models/Person'
import '@/db/models/PersonRole'   // wires Person.belongsToMany( Role ) - addRole()
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import Role from '@/db/models/Role'
import Shipment from '@/db/models/Shipment'
import sequelize from '@/db/sequelize'
import { classSeat } from '@/libs/channelOrders/classSeats'
import { parseRequestedDate } from '@/utils/shipDate'

// Accepting a reviewed Channel Order into an Order - see CONTEXT.md's
// Channel Order entry. The Order gets what hand entry gives it
// (db/actions/order.js's createOrder()): a customer, a promised date,
// an OrderProduct per product and a Piece per unit of each production
// item. Everything the channel reported - prices, shipping, tax,
// commission, ship-to - stays on the Channel Order, linked to the Order
// through ChannelOrderOrder (many-to-many, since Orders can later be
// split and combined).
//
// Class-seat lines (classSeats.js) aren't Order lines: accepting enrolls
// their seats in the Live Class each is matched to, as LiveClassAttendees
// linked back to the line. A Channel Order of class seats alone becomes
// no Order at all.

// How each channel appears among a customer's CustomerSources (names as
// the existing imported rows spell them), and the Role its customers get.
const CHANNELS = {
  etsy: {sourceType: 'website', sourceName: 'Etsy', role: 'Retail Customer'},
  squarespace: {sourceType: 'website', sourceName: 'SquareSpace', role: 'Retail Customer'},
  faire: {sourceType: 'retail', sourceName: 'Faire', role: 'Wholesale Customer'},
  indieme: {sourceType: 'retail', sourceName: 'IndieMe', role: 'Wholesale Customer'},
  houzz: {sourceType: 'retail', sourceName: 'Houzz', role: 'Retail Customer'},

  // Drop-ship: Artful Home buys at wholesale and is the customer; its
  // purchaser (only ever a name and town) stays on the Channel Order.
  artfulhome: {sourceType: 'retail', sourceName: 'Artful Home', role: 'Wholesale Customer', channelIsCustomer: 'Artful Home'},

  // Drop-ship too: the gallery is the customer, its purchaser (name and
  // address) is the Channel Order's ship-to.
  givingtree: {sourceType: 'retail', sourceName: 'The Giving Tree Gallery', role: 'Wholesale Customer', channelIsCustomer: 'The Giving Tree Gallery'},
  plumbottom: {sourceType: 'retail', sourceName: 'Plum Bottom Gallery', role: 'Wholesale Customer', channelIsCustomer: 'Plum Bottom Gallery'},   // finds 'Plum Bottom Pottery and Gallery'
}

// Production items become Pieces: finished goods (no type) and kits.
// Anything else sold as-is (supplies, bases) is an OrderProduct alone.
export const makesPieces = product => product && (product.type === null || product.type === 'kit')

// Strong matches are preselected; weaker ones are only offered.
const STRONG = new Set( ['buyer ID', 'email', 'channel'] )

const personLabel = p => [[p.firstName, p.lastName].filter( Boolean ).join( ' ' ), p.company].filter( Boolean ).join( ' — ' ) || p.email || `Person #${p.id}`
const personOption = (p, reason) => ({id: p.id, label: personLabel( p ), email: p.email, reason})

function splitName( name )
{
  const words = (name ?? '').trim().split( /\s+/ ).filter( Boolean )

  return {firstName: words.slice( 0, -1 ).join( ' ' ) || words[0] || null, lastName: words.length > 1 ? words.at( -1 ) : null}
}

// Existing People who may be this order's customer, best first, each with
// why: the channel's buyer ID on a CustomerSource, email, the channel
// itself (Artful Home), company, then name.
async function customerCandidates( order )
{
  const channel = CHANNELS[order.channel] ?? {}
  const found = new Map()
  const add = (people, reason) => people.forEach( p => found.has( p.id ) || found.set( p.id, personOption( p, reason ) ) )

  if( channel.channelIsCustomer )
    add( await Person.findAll( {where: {company: {[Op.like]: `%${channel.channelIsCustomer.split( ' ' ).join( '%' )}%`}}, limit: 5} ), 'channel' )   // 'Artful Home', 'ArtfulHome, Inc.'

  if( order.buyerExternalId && channel.sourceName )
  {
    const sources = await CustomerSource.findAll( {where: {sourceName: channel.sourceName, externalId: order.buyerExternalId}, include: [{model: Person, as: 'Customer'}]} )

    add( sources.map( s => s.Customer ).filter( Boolean ), 'buyer ID' )
  }

  if( !channel.channelIsCustomer )
  {
    if( order.buyerEmail )
      add( await Person.findAll( {where: {email: order.buyerEmail.trim()}, limit: 5} ), 'email' )

    if( order.buyerCompany )
      add( await Person.findAll( {where: {company: order.buyerCompany.trim()}, limit: 5} ), 'company' )

    const {firstName, lastName} = splitName( order.buyerName )

    if( firstName && lastName )
      add( await Person.findAll( {where: {firstName, lastName}, limit: 5} ), 'name' )
  }

  return [...found.values()]
}

// Lines as they'd be accepted, with the product or class each is matched to.
async function linesOf( channelOrderId, transaction )
{
  return ChannelOrderLine.findAll( {
    where: {channelOrderId},
    include: [{model: Product, attributes: ['id', 'sku', 'name', 'type']}, {model: LiveClass, attributes: ['id', 'name']}],
    order: [['position', 'ASC']],
    transaction,
  } )
}

// A line that's seats in a class, not a Product: matched to one, or
// described like one.
export const isClassSeatLine = line => Boolean( line.liveClassId || classSeat( line.description ) )

// Channel Orders (of `ids`) that have class seats enrolled from them.
export async function enrolledChannelOrderIds( ids, transaction )
{
  const lines = await ChannelOrderLine.findAll( {where: {channelOrderId: ids}, attributes: ['id', 'channelOrderId'], transaction} )
  const seats = lines.length ? await LiveClassAttendee.findAll( {where: {channelOrderLineId: lines.map( l => l.id )}, attributes: ['channelOrderLineId'], transaction} ) : []
  const seatLines = new Set( seats.map( a => a.channelOrderLineId ) )

  return new Set( lines.filter( l => seatLines.has( l.id ) ).map( l => l.channelOrderId ) )
}

// What's stopping it, given the quantities a person entered (lineId -> quantity).
function blockers( order, lines, quantities = {} )
{
  const problems = []

  if( order.status !== 'new' )
    problems.push( `This order is already ${order.status}` )

  // Incomplete means lines are missing (Faire's teaser email: fewer lines
  // than it says there are) or just details are; a missing quantity is
  // filled in by the person accepting, checked below.
  if( !order.linesComplete && lines.length < (order.expectedLineCount ?? 0) )
    problems.push( `Only ${lines.length} of ${order.expectedLineCount} lines - fetch the rest from the channel first` )

  if( !lines.length )
    problems.push( 'This order has no lines' )

  for( const line of lines )
  {
    const quantity = Number( quantities[line.id] ?? line.quantity )
    const what = line.sku || line.description || `Line ${line.position + 1}`

    if( isClassSeatLine( line ) )
    {
      if( !line.liveClassId )
        problems.push( `${what}: not matched to a class` )
      else if( !(quantity > 0) || !Number.isInteger( quantity ) )
        problems.push( `${what}: needs a whole number of seats` )
    }
    else if( !line.Product )
      problems.push( `${what}: not matched to a product` )
    else if( !(quantity > 0) )
      problems.push( `${what}: needs a quantity` )
    else if( makesPieces( line.Product ) && !Number.isInteger( quantity ) )
      problems.push( `${what}: a production item needs a whole-number quantity` )
  }

  return problems
}

// Everything the Accept dialog shows, ready to confirm.
export async function previewAccept( channelOrder )
{
  const lines = await linesOf( channelOrder.id )
  const candidates = await customerCandidates( channelOrder )
  const channel = CHANNELS[channelOrder.channel] ?? {}
  const preselected = candidates.find( c => STRONG.has( c.reason ) ) ?? null
  const classIds = lines.filter( isClassSeatLine ).map( l => l.liveClassId ).filter( Boolean )

  // Seats in those classes already entered by hand, which accepting
  // counts toward the seats bought rather than duplicating
  const existing = classIds.length ? await LiveClassAttendee.findAll( {where: {liveClassId: classIds, channelOrderLineId: null, status: {[Op.ne]: 'cancelled'}}} ) : []

  return {
    blocking: blockers( channelOrder, lines ),
    lines: lines.map( l => ({
      id: l.id, sku: l.sku, description: l.description, quantity: l.quantity,
      product: l.Product?.toJSON() ?? null, makesPieces: makesPieces( l.Product ),
      classSeat: isClassSeatLine( l ),
      liveClass: l.LiveClass?.toJSON() ?? null,
      existingSeats: existing.filter( a => a.liveClassId === l.liveClassId ).map( a => ({customerId: a.customerId, name: [a.firstName, a.lastName].filter( Boolean ).join( ' ' ), email: a.email}) ),
    }) ),
    makesOrder: lines.some( l => !isClassSeatLine( l ) ),
    candidates,
    customerId: preselected?.id ?? null,
    newCustomer: channel.channelIsCustomer
      ? {company: channel.channelIsCustomer}
      : {name: channelOrder.buyerName, company: channelOrder.buyerCompany, email: channelOrder.buyerEmail},
    role: channel.role ?? null,
    requestedShipDate: channelOrder.requestedShipDate,
    promisedDate: parseRequestedDate( channelOrder.requestedShipDate, channelOrder.orderedOn ),
  }
}

// A new Person from the buyer (or the channel, for Artful Home).
async function createCustomer( order, transaction )
{
  const channel = CHANNELS[order.channel] ?? {}

  if( channel.channelIsCustomer )
    return Person.create( {company: channel.channelIsCustomer}, {transaction} )

  const a = order.shipTo ?? {}

  return Person.create( {
    ...splitName( order.buyerName ),
    company: order.buyerCompany ?? null,
    email: order.buyerEmail ?? null,
    phone: order.buyerPhone ?? null,
    street1: a.street1 ?? null,
    street2: a.street2 ?? null,
    city: a.city ?? null,
    state: a.state ?? null,
    postalCode: a.postalCode ?? null,
    country: a.country ?? null,
  }, {transaction} )
}

// Records where the customer came from (once per channel, with the buyer
// ID when the channel has one) and gives them the channel's Role - when
// they bought products - and Student when they bought class seats.
async function noteCustomerChannel( person, order, {products, seats}, transaction )
{
  const channel = CHANNELS[order.channel]

  if( seats )
  {
    const student = await Role.findOne( {where: {name: 'Student'}, transaction} )

    if( student )
      await person.addRole( student, {transaction} )
  }

  if( !channel )
    return

  const source = await CustomerSource.findOne( {where: {customerId: person.id, sourceName: channel.sourceName}, transaction} )
  const externalId = channel.channelIsCustomer ? null : order.buyerExternalId ?? null

  if( !source )
    await CustomerSource.create( {customerId: person.id, sourceType: channel.sourceType, sourceName: channel.sourceName, externalId, firstSeenOn: order.orderedOn ?? undefined}, {transaction} )
  else if( externalId && !source.externalId )
    await source.update( {externalId}, {transaction} )

  const role = products && await Role.findOne( {where: {name: channel.role}, transaction} )

  if( role )
    await person.addRole( role, {transaction} )
}

// Enrolls a class-seat line's seats: the customer's own seat (unless
// they already have one there, entered by hand) and one seat per further
// unit, unnamed - the guest's name comes later. -> the seats created.
async function enrollSeats( line, quantity, customer, order, transaction )
{
  const own = await LiveClassAttendee.count( {where: {liveClassId: line.liveClassId, customerId: customer.id, channelOrderLineId: null, status: {[Op.ne]: 'cancelled'}}, transaction} )
  const source = `${CHANNELS[order.channel]?.sourceName ?? order.channel} order #${order.externalOrderId}`
  const buyer = [customer.firstName, customer.lastName].filter( Boolean ).join( ' ' ) || order.buyerName || 'the buyer'
  const seats = []

  for( let i = Math.min( own, quantity ); i < quantity; i++ )
  {
    const guest = i > 0

    seats.push( await LiveClassAttendee.create( {
      liveClassId: line.liveClassId,
      customerId: guest ? null : customer.id,
      firstName: guest ? null : customer.firstName,
      lastName: guest ? null : customer.lastName,
      email: guest ? null : customer.email ?? order.buyerEmail ?? null,
      status: 'enrolled',
      notes: guest ? `Guest of ${buyer} - ${source}` : source,
      enrolledOn: order.orderedOn ?? undefined,
      channelOrderLineId: line.id,
    }, {transaction} ) )
  }

  return seats
}

// Accepts it: {customerId (a Person's id, or 'new'), promisedDate
// (YYYY-MM-DD or blank), quantities (lineId -> quantity, for lines the
// channel left without one)} -> {orderId (null when it was all class
// seats), customerId, liveClassIds, seatCount}. Throws if it can't.
export async function acceptChannelOrder( channelOrderId, {customerId, promisedDate, quantities = {}} )
{
  return sequelize.transaction( async transaction => {
    const order = await ChannelOrder.findByPk( channelOrderId, {transaction, lock: transaction.LOCK.UPDATE} )

    if( !order )
      throw new Error( 'No such channel order' )

    const lines = await linesOf( order.id, transaction )
    const problems = blockers( order, lines, quantities )

    if( problems.length )
      throw new Error( problems.join( '; ' ) )

    const customer = customerId === 'new'
      ? await createCustomer( order, transaction )
      : await Person.findByPk( customerId, {transaction} )

    if( !customer )
      throw new Error( 'Choose a customer' )

    const seatLines = lines.filter( isClassSeatLine )
    const productLines = lines.filter( l => !isClassSeatLine( l ) )

    await noteCustomerChannel( customer, order, {products: productLines.length > 0, seats: seatLines.length > 0}, transaction )

    let seatCount = 0

    for( const line of seatLines )
      seatCount += (await enrollSeats( line, Number( quantities[line.id] ?? line.quantity ), customer, order, transaction )).length

    const done = {customerId: customer.id, liveClassIds: [...new Set( seatLines.map( l => l.liveClassId ) )], seatCount}

    if( !productLines.length )
    {
      await order.update( {status: 'accepted', customerId: customer.id}, {transaction} )

      return {...done, orderId: null}
    }

    const created = await Order.create( {
      customerId: customer.id,
      createdOn: order.orderedOn ?? undefined,
      promisedDate: promisedDate || null,
      promisedDateOrigin: promisedDate ? 'explicit' : null,
    }, {transaction} )

    // One OrderProduct per product - the Order page counts Pieces per product
    const byProduct = new Map()

    for( const line of productLines )
    {
      const entry = byProduct.get( line.Product.id ) ?? {product: line.Product, quantity: 0}

      entry.quantity += Number( quantities[line.id] ?? line.quantity )
      byProduct.set( line.Product.id, entry )
    }

    for( const {product, quantity} of byProduct.values() )
    {
      await OrderProduct.create( {orderId: created.id, productId: product.id, quantity}, {transaction} )

      if( makesPieces( product ) )
        await Piece.bulkCreate( Array.from( {length: quantity}, () => ({orderId: created.id, productId: product.id, phase: 'Design'}) ), {transaction} )
    }

    await ChannelOrderOrder.create( {channelOrderId: order.id, orderId: created.id}, {transaction} )
    await order.update( {status: 'accepted', customerId: customer.id}, {transaction} )

    return {...done, orderId: created.id}
  } )
}

// Undoes an accept while nothing has been started - every Piece still in
// Design, no Shipment made, no class seat completed: deletes the Order(s)
// it became (their products and Pieces) and the class seats it enrolled,
// and returns the Channel Order to 'new'. A customer it created is kept. Not
// once one of its Orders also carries another Channel Order (combined) -
// that Order has to be split or changed by hand instead.
export async function unacceptChannelOrder( channelOrderId )
{
  return sequelize.transaction( async transaction => {
    const order = await ChannelOrder.findByPk( channelOrderId, {transaction, lock: transaction.LOCK.UPDATE} )

    if( !order || order.status !== 'accepted' )
      throw new Error( 'This order isn\'t accepted' )

    const orderIds = (await ChannelOrderOrder.findAll( {where: {channelOrderId}, transaction} )).map( l => l.orderId )
    const lineIds = (await ChannelOrderLine.findAll( {where: {channelOrderId}, attributes: ['id'], transaction} )).map( l => l.id )
    const seats = lineIds.length ? await LiveClassAttendee.findAll( {where: {channelOrderLineId: lineIds}, transaction} ) : []

    if( seats.some( a => a.status === 'completed' ) )
      throw new Error( 'A class seat from this order is already completed - change the class\'s roster instead' )

    if( orderIds.length )
    {
      const shared = await ChannelOrderOrder.findOne( {where: {orderId: orderIds, channelOrderId: {[Op.ne]: channelOrderId}}, transaction} )

      if( shared )
        throw new Error( `Order #${shared.orderId} also carries another channel order - change it there instead` )

      const started = await Piece.count( {where: {orderId: orderIds, phase: {[Op.ne]: 'Design'}}, transaction} )

      if( started )
        throw new Error( `Work has started on ${started} piece${started === 1 ? '' : 's'} - change ${orderList( orderIds )} itself instead` )

      if( await Shipment.count( {where: {orderId: orderIds}, transaction} ) )
        throw new Error( `There are shipments on ${orderList( orderIds )} - delete them first` )

      await Piece.destroy( {where: {orderId: orderIds}, transaction} )
      await OrderProduct.destroy( {where: {orderId: orderIds}, transaction} )
      await ChannelOrderOrder.destroy( {where: {channelOrderId}, transaction} )
      await Order.destroy( {where: {id: orderIds}, transaction} )
    }

    if( seats.length )
      await LiveClassAttendee.destroy( {where: {id: seats.map( a => a.id )}, transaction} )

    await order.update( {status: 'new', customerId: null}, {transaction} )

    return {orderIds, seatCount: seats.length}
  } )
}

const orderList = ids => ids.length === 1 ? `Order #${ids[0]}` : `Orders ${ids.map( id => `#${id}` ).join( ', ' )}`
