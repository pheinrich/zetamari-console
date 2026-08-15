'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Customer from '@/db/models/Customer'
import CustomerSource from '@/db/models/CustomerSource'
import Event from '@/db/models/Event'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import LiveClass from '@/db/models/LiveClass'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { isDiscountEligible, DEFAULT_DISCOUNT_PERCENT } from '@/libs/customerLoyalty'

// acceptsEmailMarketing is tri-state (see the
// 20260815000000-customer-company-and-marketing.js migration): the form
// submits 'true'/'false'/'unknown' (a Select, not a checkbox, since a
// checkbox can't represent "unknown"). Anything other than the literal
// strings 'true'/'false' - including 'unknown' itself or a missing value -
// resolves to null.
function parseEmailMarketing( value )
{
  if( 'true' === value )
    return true

  if( 'false' === value )
    return false

  return null
}

// A class attendance "counts" toward the apron/discount thresholds once
// enrolled or completed - not while merely waitlisted, and not if later
// cancelled. Shared by readCustomer(s) below and by liveClass.js's
// enrollment action (which uses this same definition to decide whether a
// just-recorded enrollment just crossed the discount threshold).
export async function countCustomerClasses( customerId )
{
  return LiveClassAttendee.count( {
    where: {customerId, status: ['enrolled', 'completed']},
  } )
}

export async function createCustomer( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    const customer = await Customer.create( {
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      street1: data.street1 || null,
      street2: data.street2 || null,
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      country: data.country || null,
      notes: data.notes || null,
      type: data.type || null,
      website: data.website || null,
      acceptsEmailMarketing: parseEmailMarketing( data.acceptsEmailMarketing ),
      discountPercent: null != data.discountPercent && '' !== data.discountPercent ? Number( data.discountPercent ) : null,
    } )

    return {success: true, id: customer.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )

      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while creating the customer'}
  }
}

// `eager` pulls in everything the detail page shows: sources (with their
// linked Event, for art_show/conference sources), and class attendances
// (with their LiveClass) - Orders are fetched separately below (readCustomer
// callers that want them call readCustomerOrders too), since an order's
// own item count needs the same grouped-count treatment readCustomers()
// already does for the list view, not a plain eager include.
export async function readCustomer( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( eager )
  {
    const customer = await Customer.findByPk( id, {
      include: [
        {model: CustomerSource, include: [Event]},
        {model: LiveClassAttendee, include: [LiveClass]},
      ],
    } )

    return customer?.toJSON()
  }

  const customer = await Customer.findByPk( id )

  return customer?.toJSON()
}

// A customer's order history, with each order's item count (a grouped
// count against OrderProducts, same "don't rely on default association
// aliasing, just count directly" approach readCustomers()'s
// classCount/orderCount use) - kept separate from readCustomer()'s eager
// load above so the detail page can show it as its own section without
// coupling Order's shape into that query.
export async function readCustomerOrders( customerId )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const orders = await Order.findAll( {where: {customerId}, order: [['createdOn', 'DESC']]} )

  if( 0 === orders.length )
    return []

  const counts = await OrderProduct.findAll( {
    where: {orderId: orders.map( o => o.id )},
    attributes: ['orderId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['orderId'],
  } )

  const countByOrderId = {}

  for( const c of counts )
    countByOrderId[c.orderId] = Number( c.get( 'count' ) )

  return orders.map( o => ({...o.toJSON(), itemCount: countByOrderId[o.id] || 0}) )
}

export async function readCustomers()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const customers = await Customer.findAll()

  if( 0 === customers.length )
    return []

  // Order count / class count per customer for the list view - grouped
  // queries rather than eager-loading every row, same approach
  // readSuppliers() uses for productCount.
  const orderCounts = await Order.findAll( {
    where: {customerId: customers.map( c => c.id )},
    attributes: ['customerId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['customerId'],
  } )

  const orderCountByCustomerId = {}

  for( const c of orderCounts )
    orderCountByCustomerId[c.customerId] = Number( c.get( 'count' ) )

  const classCounts = await LiveClassAttendee.findAll( {
    where: {customerId: customers.map( c => c.id ), status: ['enrolled', 'completed']},
    attributes: ['customerId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['customerId'],
  } )

  const classCountByCustomerId = {}

  for( const c of classCounts )
    classCountByCustomerId[c.customerId] = Number( c.get( 'count' ) )

  // Plain objects, not Sequelize instances - needed once this crosses
  // into a 'use client' table component (same reasoning as readProducts).
  return customers.map( c => ({
    ...c.toJSON(),
    orderCount: orderCountByCustomerId[c.id] || 0,
    classCount: classCountByCustomerId[c.id] || 0,
  }) )
}

export async function updateCustomer( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const customer = await Customer.findByPk( data.id )

  if( !customer )
    notFound()

  await customer.update( {
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    company: data.company || null,
    email: data.email || null,
    phone: data.phone || null,
    street1: data.street1 || null,
    street2: data.street2 || null,
    city: data.city || null,
    state: data.state || null,
    postalCode: data.postalCode || null,
    country: data.country || null,
    notes: data.notes || null,
    type: data.type || null,
    website: data.website || null,
    acceptsEmailMarketing: parseEmailMarketing( data.acceptsEmailMarketing ),
    discountPercent: null != data.discountPercent && '' !== data.discountPercent ? Number( data.discountPercent ) : null,
  } )

  return customer.toJSON()
}

export async function deleteCustomer( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const customer = await Customer.findByPk( id )

  if( !customer )
    notFound()

  return customer.destroy()
}

// --- Sources -------------------------------------------------------------
//
// Managed independently of the main Customer form (added from the detail
// page once a Customer already exists) - same "separate mini-CRUD, not
// bundled into one big form submit" approach as BomEditor.jsx's BOM
// lines/SupplierProduct pricing elsewhere in this app.

export async function addCustomerSource( customerId, data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    const source = await CustomerSource.create( {
      customerId,
      sourceType: data.sourceType,
      sourceName: data.sourceName || null,
      eventId: data.eventId || null,
      externalId: data.externalId || null,
      notes: data.notes || null,
    } )

    return {success: true, id: source.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while adding the source'}
  }
}

export async function removeCustomerSource( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const source = await CustomerSource.findByPk( id )

  if( !source )
    notFound()

  return source.destroy()
}

// --- Loyalty ---------------------------------------------------------------

// Called after recording a class enrollment (see liveClass.js's
// addLiveClassAttendee) - seeds Customer.discountPercent to the standard
// 20% the first time a customer's class count crosses the discount
// threshold, but only if they don't already have a rate set (never
// clobbers a rate Angie already adjusted, up or down, by hand).
export async function seedDiscountIfEligible( customerId )
{
  if( !customerId )
    return

  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const customer = await Customer.findByPk( customerId )

  if( !customer || null != customer.discountPercent )
    return

  const classCount = await countCustomerClasses( customerId )

  if( isDiscountEligible( classCount ) )
    await customer.update( {discountPercent: DEFAULT_DISCOUNT_PERCENT} )
}
