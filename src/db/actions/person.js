'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Op, Sequelize } from 'sequelize'
import bcrypt from 'bcryptjs'
import Person from '@/db/models/Person'
import Role from '@/db/models/Role'
// Side-effect import - wires up Person.belongsToMany(Role) (setRoles()
// below) and the reverse association. Not referenced directly here.
import '@/db/models/PersonRole'
import CustomerSource from '@/db/models/CustomerSource'
import Event from '@/db/models/Event'
import Order from '@/db/models/Order'
import OrderProduct from '@/db/models/OrderProduct'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import LiveClass from '@/db/models/LiveClass'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { isDiscountEligible, DEFAULT_DISCOUNT_PERCENT } from '@/libs/customerLoyalty'

// Users and Customers were merged into one People table (see
// 20260917010000-merge-people.js and CONTEXT.md's Person entry) - what
// used to be User.js/Customer.js's two action files is now this one.
// The /users and /customers pages both read/write Person; the only
// thing distinguishing "a User" from "a Contact" is whether a password
// is set (see readUsers()/readCustomers() below) - there's no separate
// stored flag, same spirit as the old "is a student" derivation.
// Which capacities a Person acts in (Owner, Admin, Retail Customer,
// Student, ...) are Role assignments (setPersonRoles()), not columns.

// Never select the hashed password out to the client.
const PUBLIC_ATTRIBUTES = {exclude: ['password']}

async function setPersonRoles( personId, roleIds, transaction )
{
  const person = await Person.findByPk( personId, {transaction} )

  if( person )
    await person.setRoles( roleIds || [], {transaction} )
}

// --- Users (People with a password - can log in) --------------------------

export async function createUser( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.password )
    return {error: 'Password is required'}

  try
  {
    const person = await sequelize.transaction( async t => {
      const created = await Person.create( {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        password: data.password,
      }, {transaction: t} )

      await setPersonRoles( created.id, data.roleIds, t )

      return created
    } )

    return {success: true, id: person.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the user'}
  }
}

export async function readUser( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const person = await Person.findByPk( id, {attributes: PUBLIC_ATTRIBUTES, include: eager ? [Role] : undefined} )

  return person?.toJSON()
}

export async function readUsers()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const people = await Person.findAll( {
    where: {password: {[Op.ne]: null}},
    attributes: PUBLIC_ATTRIBUTES,
    include: [Role],
  } )

  return people.map( p => p.toJSON() )
}

export async function updateUser( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const person = await Person.findByPk( data.id )

  if( !person )
    notFound()

  try
  {
    await sequelize.transaction( async t => {
      // A blank password leaves the existing one unchanged - Person has
      // no beforeUpdate hook (only beforeCreate), so this path hashes a
      // newly-supplied password itself, same as User.js used to.
      const password = data.password ? await bcrypt.hash( data.password, 10 ) : person.password

      await person.update( {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        password,
      }, {transaction: t} )

      await setPersonRoles( person.id, data.roleIds, t )
    } )

    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while updating the user'}
  }
}

export async function deleteUser( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const person = await Person.findByPk( id )

  if( !person )
    notFound()

  return person.destroy()
}

// Every Person, regardless of Role or password - for pickers that
// genuinely mean "anyone" (e.g. a Basic Event's Participants multi-
// select, where a participant could be staff, a customer, or a student).
export async function readPeople()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const people = await Person.findAll( {attributes: PUBLIC_ATTRIBUTES} )

  return people.map( p => p.toJSON() )
}

// --- Customers/Contacts (People, regardless of password) ------------------

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
    const person = await sequelize.transaction( async t => {
      const created = await Person.create( {
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
        website: data.website || null,
        acceptsEmailMarketing: parseEmailMarketing( data.acceptsEmailMarketing ),
        discountPercent: null != data.discountPercent && '' !== data.discountPercent ? Number( data.discountPercent ) : null,
      }, {transaction: t} )

      await setPersonRoles( created.id, data.roleIds, t )

      return created
    } )

    return {success: true, id: person.id}
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

// acceptsEmailMarketing is tri-state (see the Person model's doc
// comment): the form submits 'true'/'false'/'unknown' (a Select, not a
// checkbox, since a checkbox can't represent "unknown"). Anything other
// than the literal strings 'true'/'false' - including 'unknown' itself
// or a missing value - resolves to null.
function parseEmailMarketing( value )
{
  if( 'true' === value )
    return true

  if( 'false' === value )
    return false

  return null
}

// `eager` pulls in everything the detail page shows: sources (with their
// linked Event, for art_show/conference sources), class attendances
// (with their LiveClass), and assigned Roles.
export async function readCustomer( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( eager )
  {
    const person = await Person.findByPk( id, {
      include: [
        {model: CustomerSource, include: [Event]},
        {model: LiveClassAttendee, include: [LiveClass]},
        Role,
      ],
    } )

    return person?.toJSON()
  }

  const person = await Person.findByPk( id, {include: [Role]} )

  return person?.toJSON()
}

// A customer's order history, with each order's item count (a grouped
// count against OrderProducts).
export async function readCustomerOrders( customerId )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const orders = await Order.findAll( {where: {customerId}, order: [['createdOn', 'DESC']]} )

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

  return orders.map( o => ({...o.toJSON(), itemCount: countByOrderId[o.id] || 0}) )
}

export async function readCustomers()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const customers = await Person.findAll( {where: {password: null}, include: [Role]} )

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
  const person = await Person.findByPk( data.id )

  if( !person )
    notFound()

  await sequelize.transaction( async t => {
    await person.update( {
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
      website: data.website || null,
      acceptsEmailMarketing: parseEmailMarketing( data.acceptsEmailMarketing ),
      discountPercent: null != data.discountPercent && '' !== data.discountPercent ? Number( data.discountPercent ) : null,
    }, {transaction: t} )

    await setPersonRoles( person.id, data.roleIds, t )
  } )

  return person.toJSON()
}

export async function deleteCustomer( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const person = await Person.findByPk( id )

  if( !person )
    notFound()

  return person.destroy()
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
// addLiveClassAttendee) - seeds Person.discountPercent to the standard
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
  const person = await Person.findByPk( customerId )

  if( !person || null != person.discountPercent )
    return

  const classCount = await countCustomerClasses( customerId )

  if( isDiscountEligible( classCount ) )
    await person.update( {discountPercent: DEFAULT_DISCOUNT_PERCENT} )
}
