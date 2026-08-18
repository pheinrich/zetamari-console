'use server'

import { unauthorized } from 'next/navigation'

import { Op } from 'sequelize'

import User from '@/db/models/User'
import CapacityEvent from '@/db/models/CapacityEvent'
import CapacityEventPerson from '@/db/models/CapacityEventPerson'
import GroutingDay from '@/db/models/GroutingDay'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markAllOrdersScheduleStale } from '@/db/actions/scheduling'
import { parseCapacityFormula } from '@/libs/pieceScheduling'

// Everything the Capacity calendar needs at once - Owners/Assistants
// (Users), CapacityEvents (with their assigned people), and GroutingDay
// dates (just for a marker on the calendar). No date filtering
// server-side; the calendar pages through months client-side against
// this whole set, since the row counts involved are tiny (a couple of
// Owners, at most a handful of Events at a time).
export async function readSchedulingInputs()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const [users, capacityEvents, groutingDays] = await Promise.all( [
    User.findAll( {attributes: ['id', 'name', 'role'], order: [['name', 'ASC']]} ),
    CapacityEvent.findAll( {include: CapacityEventPerson, order: [['startDate', 'ASC']]} ),
    GroutingDay.findAll( {attributes: ['id', 'date']} ),
  ] )

  return {
    users: users.map( u => u.toJSON() ),
    capacityEvents: capacityEvents.map( e => e.toJSON() ),
    groutingDays: groutingDays.map( g => g.toJSON() ),
  }
}

// Finds the first assigned person (matched by userId for Owners, by
// trimmed/case-insensitive name for Assistants) who already has another
// CapacityEvent covering an overlapping day - see CapacityEventPerson.js's
// doc comment for why this is enforced here rather than left ambiguous.
// `excludeEventId` skips the event being edited so re-saving it against
// itself never self-conflicts. Returns an error string, or null.
async function findOverlapError( startDate, endDate, who, excludeEventId )
{
  const overlapping = await CapacityEvent.findAll( {
    where: {
      id: excludeEventId ? {[Op.ne]: excludeEventId} : {[Op.ne]: -1},
      startDate: {[Op.lte]: endDate},
      endDate: {[Op.gte]: startDate},
    },
    include: CapacityEventPerson,
  } )

  for( const person of who )
  {
    const conflict = overlapping.find( event => event.CapacityEventPeople.some( p =>
      null != person.userId
        ? p.userId === person.userId
        : (p.assistantName ?? '').trim().toLowerCase() === (person.assistantName ?? '').trim().toLowerCase()
    ) )

    if( conflict )
      return `${person.displayName} is already scheduled on "${conflict.title}" (${conflict.startDate} – ${conflict.endDate})`
  }

  return null
}

// Creates a new CapacityEvent (no `id`) or replaces an existing one's
// fields and person assignments wholesale (simplest correct approach -
// callers always resend the full `who` list, so a stale row left behind
// by a partial update can't happen). `who` is
// [{userId?, assistantName?, capacity: "8+1+4" | "8*5", displayName}] -
// see parseCapacityFormula() for that format; displayName is only used
// in the overlap error message.
export async function upsertCapacityEvent( id, {title, startDate, endDate, color, notes, who} )
{
  const session = await auth()

  if( !session )
    unauthorized()

  if( !title?.trim() )
    return {error: 'Title is required'}
  if( !startDate || !endDate || endDate < startDate )
    return {error: 'End date must be on or after the start date'}
  if( !who?.length )
    return {error: 'At least one Owner or Assistant must be assigned'}

  const parsedWho = []

  for( const w of who )
  {
    const capacity = parseCapacityFormula( w.capacity )

    if( !capacity )
      return {error: `${w.displayName}'s capacity must be a "+"/"*" formula, e.g. "8+1+4" or "8*5"`}

    parsedWho.push( {...w, capacity} )
  }

  await sequelize.sync()

  const overlapError = await findOverlapError( startDate, endDate, parsedWho, id )

  if( overlapError )
    return {error: overlapError}

  await sequelize.transaction( async t => {
    const event = id
      ? await CapacityEvent.findByPk( id, {transaction: t} )
      : await CapacityEvent.create( {title, startDate, endDate, color, notes}, {transaction: t} )

    if( id )
    {
      await event.update( {title, startDate, endDate, color, notes}, {transaction: t} )
      await CapacityEventPerson.destroy( {where: {capacityEventId: event.id}, transaction: t} )
    }

    await CapacityEventPerson.bulkCreate(
      parsedWho.map( w => ({
        capacityEventId: event.id,
        userId: w.userId ?? null,
        assistantName: w.userId ? null : w.assistantName.trim(),
        capacity: w.capacity,
      }) ),
      {transaction: t}
    )
  } )

  await markAllOrdersScheduleStale()

  return {success: true}
}

export async function deleteCapacityEvent( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  await CapacityEvent.destroy( {where: {id}} )
  await markAllOrdersScheduleStale()

  return {success: true}
}
