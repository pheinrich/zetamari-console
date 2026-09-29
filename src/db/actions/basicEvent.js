'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import BasicEvent from '@/db/models/BasicEvent'
import Person from '@/db/models/Person'
import Event from '@/db/models/Event'
import LiveClass from '@/db/models/LiveClass'
// Side-effect import - wires up BasicEvent.belongsToMany(Person, {as:
// 'Participants'}) (see that model). Not referenced directly here, but
// nothing else in this file's import graph loads it, and without it
// Sequelize throws "Person is not associated to BasicEvent!" the first
// time anything in this process tries to `include` Participants.
import '@/db/models/BasicEventParticipant'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Generic CRUD for BasicEvent (Title/Start Datetime/End Datetime/Color/
// Description) - see that model's doc comment and docs/adr/0008. Shared
// by the standalone /calendar page and by Event/LiveClass's own
// occurrence editors: `data.eventId`/`data.liveClassId` are optional, so
// one action set covers a freestanding calendar entry and a show/class
// occurrence alike rather than duplicating this per parent type.

export async function createBasicEvent( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.title?.trim() )
    return {error: 'Title is required'}
  if( !data.startDatetime || !data.endDatetime )
    return {error: 'Start and end are required'}
  if( data.endDatetime < data.startDatetime )
    return {error: 'End must be on or after the start'}

  try
  {
    const event = await BasicEvent.create( {
      title: data.title,
      startDatetime: data.startDatetime,
      endDatetime: data.endDatetime,
      color: data.color || 'primary',
      description: data.description || null,
      eventId: data.eventId || null,
      liveClassId: data.liveClassId || null,
    } )

    if( data.participantIds )
      await event.setParticipants( data.participantIds )

    return {success: true, id: event.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the event'}
  }
}

export async function readBasicEvent( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await BasicEvent.findByPk( id, {include: [{model: Person, as: 'Participants'}]} )

  return event?.toJSON()
}

// `where` optionally scopes to one parent (`{eventId}`/`{liveClassId}`);
// omitted entirely for the standalone /calendar page's "everything" view.
export async function readBasicEvents( where )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const events = await BasicEvent.findAll( {
    where: where || undefined,
    include: [{model: Person, as: 'Participants'}, Event, LiveClass],
    order: [['startDatetime', 'ASC']],
  } )

  return events.map( e => e.toJSON() )
}

export async function updateBasicEvent( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await BasicEvent.findByPk( data.id )

  if( !event )
    notFound()

  if( !data.title?.trim() )
    return {error: 'Title is required'}
  if( !data.startDatetime || !data.endDatetime )
    return {error: 'Start and end are required'}
  if( data.endDatetime < data.startDatetime )
    return {error: 'End must be on or after the start'}

  await event.update( {
    title: data.title,
    startDatetime: data.startDatetime,
    endDatetime: data.endDatetime,
    color: data.color || 'primary',
    description: data.description || null,
  } )

  if( data.participantIds )
    await event.setParticipants( data.participantIds )

  return {success: true}
}

export async function deleteBasicEvent( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await BasicEvent.findByPk( id )

  if( !event )
    notFound()

  await event.destroy()
}

export async function addParticipant( basicEventId, personId )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await BasicEvent.findByPk( basicEventId )

  if( !event )
    notFound()

  await event.addParticipant( personId )

  return {success: true}
}

export async function removeParticipant( basicEventId, personId )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await BasicEvent.findByPk( basicEventId )

  if( !event )
    notFound()

  await event.removeParticipant( personId )

  return {success: true}
}
