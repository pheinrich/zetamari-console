'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import LiveClass from '@/db/models/LiveClass'
import LiveClassAttendee from '@/db/models/LiveClassAttendee'
import Customer from '@/db/models/Customer'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { seedDiscountIfEligible } from '@/db/actions/customer'

export async function createLiveClass( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}
  if( !data.startDate )
    return {error: 'Start date is required'}

  try
  {
    const liveClass = await LiveClass.create( {
      name: data.name,
      locationType: data.locationType || 'in_person',
      locationName: data.locationName || null,
      locationAddress: data.locationAddress || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      cost: null != data.cost && '' !== data.cost ? Number( data.cost ) : null,
      notes: data.notes || null,
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
      include: [{model: LiveClassAttendee, include: [Customer]}],
    } )

    return liveClass?.toJSON()
  }

  const liveClass = await LiveClass.findByPk( id )

  return liveClass?.toJSON()
}

export async function readLiveClasses()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const liveClasses = await LiveClass.findAll( {order: [['startDate', 'DESC']]} )

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

  return liveClasses.map( c => ({...c.toJSON(), attendeeCount: countByClassId[c.id] || 0}) )
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
    locationName: data.locationName || null,
    locationAddress: data.locationAddress || null,
    startDate: data.startDate,
    endDate: data.endDate || null,
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

  return liveClass.destroy()
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
      const customer = await Customer.findByPk( data.customerId )

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

export async function removeLiveClassAttendee( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const attendee = await LiveClassAttendee.findByPk( id )

  if( !attendee )
    notFound()

  return attendee.destroy()
}
