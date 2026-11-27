'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Address from '@/db/models/Address'
import LiveClass from '@/db/models/LiveClass'
import Location from '@/db/models/Location'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import BasicEvent from '@/db/models/BasicEvent'
import Person from '@/db/models/Person'
import '@/db/models/PersonRole'   // wires Person.belongsToMany( Role ) - addRole()
import Role from '@/db/models/Role'
// Side-effect import - wires up BasicEvent.belongsToMany(Person, {as:
// 'Participants'}), which readLiveClass()'s eager include below needs.
import '@/db/models/BasicEventParticipant'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { seedDiscountIfEligible } from '@/db/actions/person'
import { occurrenceDateRange } from '@/utils/basicEventFormat'
import { addressFields, saveOwnedAddress } from '@/libs/addresses'

// A class's Location with its Address, for every read that shows one
const WITH_LOCATION = {model: Location, include: [Address]}

export async function createLiveClass( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}

  // Its first occurrences, from the Create form: [{title, startDatetime,
  // endDatetime}] as JSON, the datetimes already ISO instants.
  let occurrences = []

  try
  {
    occurrences = JSON.parse( data.occurrences || '[]' ).map( o => ({title: o.title?.trim(), startDatetime: new Date( o.startDatetime ), endDatetime: new Date( o.endDatetime )}) )
  }
  catch
  {
    return {error: 'The occurrences couldn\'t be read'}
  }

  for( const o of occurrences )
    if( !o.title || isNaN( o.startDatetime ) || isNaN( o.endDatetime ) || o.endDatetime < o.startDatetime )
      return {error: 'Each occurrence needs a title, and a start no later than its end'}

  try
  {
    const liveClass = await sequelize.transaction( async transaction => {
      const created = await LiveClass.create( {
        name: data.name,
        locationType: data.locationType || 'in_person',
        locationId: data.locationId ? Number( data.locationId ) : null,
        sku: data.sku?.trim() || null,
        sku: data.sku?.trim() || null,
    cost: null != data.cost && '' !== data.cost ? Number( data.cost ) : null,
        notes: data.notes || null,
      }, {transaction} )

      if( occurrences.length )
        await BasicEvent.bulkCreate( occurrences.map( o => ({...o, color: 'primary', liveClassId: created.id}) ), {transaction} )

      return created
    } )

    return {success: true, id: liveClass.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the class'}
  }
}

export async function readLiveClass( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( eager )
  {
    const liveClass = await LiveClass.findByPk( id, {
      include: [
        {model: LiveClassAttendee, include: [{model: Person, as: 'Customer'}]},
        {model: BasicEvent, include: [{model: Person, as: 'Participants'}]},
        WITH_LOCATION,
      ],

      // Without this, occurrences come back in whatever order the DB
      // happens to return them (not necessarily chronological), so the
      // Occurrences editor's row order - and which occurrence renders as
      // the first row - would be arbitrary. Same order readBasicEvents()
      // already uses for the standalone /calendar page.
      order: [[BasicEvent, 'startDatetime', 'ASC']],
    } )

    return liveClass?.toJSON()
  }

  const liveClass = await LiveClass.findByPk( id, {include: [WITH_LOCATION]} )

  return liveClass?.toJSON()
}

export async function readLiveClasses()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const liveClasses = await LiveClass.findAll( {include: [BasicEvent, WITH_LOCATION]} )

  if( 0 === liveClasses.length )
    return []

  // Attendee count per class for the list view - excludes cancelled
  // seats, same "counts" definition as countCustomerClasses() in
  // customer.js.
  const counts = await LiveClassAttendee.findAll( {
    where: {liveClassId: liveClasses.map( c => c.id ), status: ['enrolled', 'completed', 'waitlisted']},
    attributes: ['liveClassId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['liveClassId'],
  } )

  const countByClassId = {}

  for( const c of counts )
    countByClassId[c.liveClassId] = Number( c.get( 'count' ) )

  return liveClasses
    .map( c => ({...c.toJSON(), attendeeCount: countByClassId[c.id] || 0, ...occurrenceDateRange( c.BasicEvents )}) )
    .sort( (a, b) => (b.startDate || '').localeCompare( a.startDate || '' ) )
}

// --- Locations (see Location.js) ---------------------------------------

// Every Location with its Address and how many classes are held there -
// what the class form's location picker lists, edits and deletes.
export async function readLocations()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const [locations, counts] = await Promise.all( [
    Location.findAll( {include: [Address], order: [['name', 'ASC']]} ),
    LiveClass.findAll( {
      where: {locationId: {[Sequelize.Op.ne]: null}},
      attributes: ['locationId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
      group: ['locationId'],
    } ),
  ] )

  const countById = Object.fromEntries( counts.map( c => [c.locationId, Number( c.get( 'count' ) )] ) )

  return locations.map( l => ({...l.toJSON(), classCount: countById[l.id] || 0}) )
}

// {name, address: {street1, ...}} -> {success, location} or {error}
export async function createLocation( {name, address} )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !name?.trim() )
    return {error: 'A location needs a name'}

  if( await Location.count( {where: {name: name.trim()}} ) )
    return {error: `There's already a location named ${name.trim()}`}

  const location = await sequelize.transaction( async transaction => {
    const created = await Location.create( {name: name.trim()}, {transaction} )

    await saveOwnedAddress( created, address, transaction )

    return created
  } )

  return {success: true, location: await readLocationJSON( location.id )}
}

// Renames/re-addresses a Location - for every class held there.
export async function updateLocation( id, {name, address} )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const location = await Location.findByPk( id )

  if( !location )
    notFound()

  if( !name?.trim() )
    return {error: 'A location needs a name'}

  if( await Location.count( {where: {name: name.trim(), id: {[Sequelize.Op.ne]: id}}} ) )
    return {error: `There's already a location named ${name.trim()}`}

  await sequelize.transaction( async transaction => {
    await location.update( {name: name.trim()}, {transaction} )
    await saveOwnedAddress( location, addressFields( address ), transaction )
  } )

  return {success: true, location: await readLocationJSON( id )}
}

// Refused while any class is held there.
export async function deleteLocation( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const location = await Location.findByPk( id )

  if( !location )
    notFound()

  const classes = await LiveClass.count( {where: {locationId: id}} )

  if( classes )
    return {error: `${location.name} is used by ${classes} class${classes === 1 ? '' : 'es'} - move them elsewhere first`}

  await sequelize.transaction( async transaction => {
    await location.destroy( {transaction} )

    if( location.addressId )
      await Address.destroy( {where: {id: location.addressId}, transaction} )
  } )

  return {success: true}
}

async function readLocationJSON( id )
{
  const location = await Location.findByPk( id, {include: [Address]} )

  return {...location.toJSON(), classCount: await LiveClass.count( {where: {locationId: id}} )}
}

export async function updateLiveClass( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const liveClass = await LiveClass.findByPk( data.id )

  if( !liveClass )
    notFound()

  await liveClass.update( {
    name: data.name,
    locationType: data.locationType || 'in_person',
    locationId: data.locationId ? Number( data.locationId ) : null,
    sku: data.sku?.trim() || null,
    cost: null != data.cost && '' !== data.cost ? Number( data.cost ) : null,
    notes: data.notes || null,
  } )

  return liveClass.toJSON()
}

export async function deleteLiveClass( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const liveClass = await LiveClass.findByPk( id )

  if( !liveClass )
    notFound()

  await liveClass.destroy()
}

// --- Attendees (LiveClassAttendee, deliberately not "Student") -----------
//
// `customerId` is optional - a seat need not belong to a Customer record
// at all (see LiveClassAttendee.js). When it does, firstName/lastName
// default from that Customer if not supplied, but are always stored
// directly on the attendee row - a snapshot, not a live reference.

export async function addLiveClassAttendee( liveClassId, data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    let firstName = data.firstName || null
    let lastName = data.lastName || null
    let email = data.email || null

    if( data.customerId && (!firstName || !lastName || !email) )
    {
      const customer = await Person.findByPk( data.customerId )

      firstName = firstName || customer?.firstName || null
      lastName = lastName || customer?.lastName || null
      email = email || customer?.email || null
    }

    const attendee = await LiveClassAttendee.create( {
      liveClassId,
      customerId: data.customerId || null,
      firstName,
      lastName,
      email,
      status: data.status || 'enrolled',
      discountPercent: null != data.discountPercent && '' !== data.discountPercent ? Number( data.discountPercent ) : null,
      upgradeNotes: data.upgradeNotes || null,
      notes: data.notes || null,
    } )

    // Only enrolled/completed seats count toward the discount threshold
    // (see countCustomerClasses() in customer.js) - a class just added as
    // 'waitlisted' shouldn't seed anything until it's actually attended.
    if( data.customerId && ['enrolled', 'completed'].includes( attendee.status ) )
      await seedDiscountIfEligible( data.customerId )

    return {success: true, id: attendee.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while adding the attendee'}
  }
}

// `updates` should only contain the fields being changed - passed
// straight to Sequelize's update() so omitted fields are left alone,
// same convention as updateSupplierProductPrice() in supplier.js.
export async function updateLiveClassAttendee( id, updates )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const attendee = await LiveClassAttendee.findByPk( id )

  if( !attendee )
    notFound()

  await attendee.update( updates )

  if( attendee.customerId && ['enrolled', 'completed'].includes( attendee.status ) )
    await seedDiscountIfEligible( attendee.customerId )

  return attendee.toJSON()
}

// Who a seat belongs to: `customerId` is an existing Person's id, 'new'
// (create a Person - a Student - from firstName/lastName/email), or null
// (not linked). A linked seat's name and email are copied from its
// customer, as when one is added; an unlinked one keeps the name and
// email given here.
export async function setLiveClassAttendeeCustomer( id, {customerId, firstName, lastName, email} )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const attendee = await LiveClassAttendee.findByPk( id )

  if( !attendee )
    notFound()

  const details = {firstName: firstName?.trim() || null, lastName: lastName?.trim() || null, email: email?.trim() || null}

  try
  {
    const linkedId = await sequelize.transaction( async transaction => {
      if( !customerId )
      {
        await attendee.update( {customerId: null, ...details}, {transaction} )

        return null
      }

      let customer

      if( customerId === 'new' )
      {
        if( !details.firstName && !details.lastName && !details.email )
          throw new Error( 'A new customer needs a name or an email' )

        customer = await Person.create( details, {transaction} )

        const student = await Role.findOne( {where: {name: 'Student'}, transaction} )

        if( student )
          await customer.addRole( student, {transaction} )
      }
      else
        customer = await Person.findByPk( customerId, {transaction} )

      if( !customer )
        throw new Error( 'That customer no longer exists' )

      await attendee.update( {customerId: customer.id, firstName: customer.firstName, lastName: customer.lastName, email: customer.email}, {transaction} )

      return customer.id
    } )

    if( linkedId && ['enrolled', 'completed'].includes( attendee.status ) )
      await seedDiscountIfEligible( linkedId )

    return {success: true, customerId: linkedId}
  }
  catch( error )
  {
    return {error: error.message || 'An unexpected error occurred while changing the attendee'}
  }
}

export async function removeLiveClassAttendee( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const attendee = await LiveClassAttendee.findByPk( id )

  if( !attendee )
    notFound()

  await attendee.destroy()
}
