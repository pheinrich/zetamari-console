import { Op } from 'sequelize'

import ChannelOrder, { ChannelOrderOrder } from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import CustomerSource from '@/db/models/CustomerSource'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import Person from '@/db/models/Person'
import '@/db/models/PersonRole'   // wires Person.belongsToMany( Role ) - addRole()
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import Role from '@/db/models/Role'
import Shipment from '@/db/models/Shipment'
import sequelize from '@/db/sequelize'
import { parseRequestedDate } from '@/utils/shipDate'

// Accepting a reviewed Channel Order into an Order - see CONTEXT.md's
// Channel Order entry. The Order gets what hand entry gives it
// (db/actions/order.js's createOrder()): a customer, a promised date,
// an OrderProduct per product and a Piece per unit of each production
// item. Everything the channel reported - prices, shipping, tax,
// commission, ship-to - stays on the Channel Order, linked to the Order
// through ChannelOrderOrder (many-to-many, since Orders can later be
// split and combined).

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

// Lines as they'd be accepted, with the product each is matched to.
async function linesOf( channelOrderId, transaction )
{
  return ChannelOrderLine.findAll( {
    where: {channelOrderId},
    include: [{model: Product, attributes: ['id', 'sku', 'name', 'type']}],
    order: [['position', 'ASC']],
    transaction,
  } )
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

    if( !line.Product )
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

  return {
    blocking: blockers( channelOrder, lines ),
    lines: lines.map( l => ({
      id: l.id, sku: l.sku, description: l.description, quantity: l.quantity,
      product: l.Product?.toJSON() ?? null, makesPieces: makesPieces( l.Product ),
    }) ),
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
// ID when the channel has one) and gives them the channel's Role.
async function noteCustomerChannel( person, order, transaction )
{
  const channel = CHANNELS[order.channel]

  if( !channel )
    return

  const source = await CustomerSource.findOne( {where: {customerId: person.id, sourceName: channel.sourceName}, transaction} )
  const externalId = channel.channelIsCustomer ? null : order.buyerExternalId ?? null

  if( !source )
    await CustomerSource.create( {customerId: person.id, sourceType: channel.sourceType, sourceName: channel.sourceName, externalId, firstSeenOn: order.orderedOn ?? undefined}, {transaction} )
  else if( externalId && !source.externalId )
    await source.update( {externalId}, {transaction} )

  const role = await Role.findOne( {where: {name: channel.role}, transaction} )

  if( role )
    await person.addRole( role, {transaction} )
}

// Accepts it: {customerId (a Person's id, or 'new'), promisedDate
// (YYYY-MM-DD or blank), quantities (lineId -> quantity, for lines the
// channel left without one)} -> the new Order's id. Throws if it can't.
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

    await noteCustomerChannel( customer, order, transaction )

    const created = await Order.create( {
      customerId: customer.id,
      createdOn: order.orderedOn ?? undefined,
      promisedDate: promisedDate || null,
      promisedDateOrigin: promisedDate ? 'explicit' : null,
    }, {transaction} )

    // One OrderProduct per product - the Order page counts Pieces per product
    const byProduct = new Map()

    for( const line of lines )
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

    return created.id
  } )
}

// Undoes an accept while nothing has been started - every Piece still in
// Design, and no Shipment made: deletes the Order(s) it became (their products and Pieces) and
// returns the Channel Order to 'new'. A customer it created is kept. Not
// once one of its Orders also carries another Channel Order (combined) -
// that Order has to be split or changed by hand instead.
export async function unacceptChannelOrder( channelOrderId )
{
  return sequelize.transaction( async transaction => {
    const order = await ChannelOrder.findByPk( channelOrderId, {transaction, lock: transaction.LOCK.UPDATE} )

    if( !order || order.status !== 'accepted' )
      throw new Error( 'This order isn\'t accepted' )

    const orderIds = (await ChannelOrderOrder.findAll( {where: {channelOrderId}, transaction} )).map( l => l.orderId )

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

    await order.update( {status: 'new', customerId: null}, {transaction} )

    return orderIds
  } )
}

const orderList = ids => ids.length === 1 ? `Order #${ids[0]}` : `Orders ${ids.map( id => `#${id}` ).join( ', ' )}`
