'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Event from '@/db/models/Event'
import BasicEvent from '@/db/models/BasicEvent'
import Person from '@/db/models/Person'
// Side-effect import - wires up BasicEvent.belongsToMany(Person, {as:
// 'Participants'}), which readEvent()'s eager include below needs.
import '@/db/models/BasicEventParticipant'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { occurrenceDateRange } from '@/utils/basicEventFormat'

// Deliberately lightweight - art shows/conferences are being modeled now
// (per Angie's explicit request, ahead of eventually breaking them out
// into their own dedicated feature) so CustomerSource has somewhere real
// to point for 'art_show'/'conference' sources, but the UI here is just
// enough to create/list/edit/delete an Event, not a full CRM for events.
//
// An Event's schedule is entirely its BasicEvent occurrences now (see
// that model and docs/adr/0008) - managed from the detail page
// (BasicEventEditor), not this form.

export async function createEvent( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}
  if( !data.type )
    return {error: 'Type is required'}

  try
  {
    const event = await Event.create( {
      type: data.type,
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      boothNumber: data.boothNumber || null,
    } )

    return {success: true, id: event.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the event'}
  }
}

export async function readEvent( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await Event.findByPk(
    id,
    eager
      ? {
        include: [{model: BasicEvent, include: [{model: Person, as: 'Participants'}]}],

        // Same reasoning as readLiveClass() - without this, occurrence
        // row order (and which occurrence renders first) is arbitrary.
        order: [[BasicEvent, 'startDatetime', 'ASC']],
      }
      : undefined
  )

  return event?.toJSON()
}

export async function readEvents()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const events = await Event.findAll( {include: [BasicEvent]} )

  // No more single startDate column to ORDER BY in SQL - the schedule is
  // now each row's BasicEvents, so the "most recent first" sort happens
  // here instead, off the same computed range the list table displays.
  return events
    .map( e => ({...e.toJSON(), ...occurrenceDateRange( e.BasicEvents )}) )
    .sort( (a, b) => (b.startDate || '').localeCompare( a.startDate || '' ) )
}

export async function updateEvent( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await Event.findByPk( data.id )

  if( !event )
    notFound()

  await event.update( {
    type: data.type,
    name: data.name,
    address: data.address || null,
    phone: data.phone || null,
    email: data.email || null,
    website: data.website || null,
    boothNumber: data.boothNumber || null,
  } )

  return event.toJSON()
}

export async function deleteEvent( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await Event.findByPk( id )

  if( !event )
    notFound()

  await event.destroy()
}
