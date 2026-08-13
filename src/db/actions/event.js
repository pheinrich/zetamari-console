'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Event from '@/db/models/Event'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Deliberately lightweight - art shows/conferences are being modeled now
// (per Angie's explicit request, ahead of eventually breaking them out
// into their own dedicated feature) so CustomerSource has somewhere real
// to point for 'art_show'/'conference' sources, but the UI here is just
// enough to create/list/edit/delete an Event, not a full CRM for events.

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
      startDate: data.startDate || null,
      endDate: data.endDate || null,
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

export async function readEvent( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const event = await Event.findByPk( id )

  return event?.toJSON()
}

export async function readEvents()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const events = await Event.findAll( {order: [['startDate', 'DESC']]} )

  return events.map( e => e.toJSON() )
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
    startDate: data.startDate || null,
    endDate: data.endDate || null,
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

  return event.destroy()
}
