'use server'

import { unauthorized } from 'next/navigation'
import User from '@/db/models/User'
import Capacity from '@/db/models/Capacity'
import WeeklyBudget from '@/db/models/WeeklyBudget'
import AssistantAvailability from '@/db/models/AssistantAvailability'
import GroutingDay from '@/db/models/GroutingDay'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markAllOrdersScheduleStale } from '@/db/actions/scheduling'

// Everything the Capacity calendar needs at once - Users, Capacity
// overrides, AssistantAvailability, and GroutingDay dates (just for a
// marker on the calendar). No date filtering server-side; the calendar
// pages through months client-side against this whole set, since the
// row counts involved are tiny (a couple of Owners, at most a
// handful of overrides/assistant entries at a time). weeklyBudgets is
// still returned (WeeklyBudget stays a live fallback tier in
// resolveDailyCapacity() even though it has no editing UI anymore) so
// the calendar's computed-default display stays accurate against
// whatever's already in the table.
export async function readSchedulingInputs()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [users, capacities, weeklyBudgets, assistantAvailability, groutingDays] = await Promise.all( [
    User.findAll( {attributes: ['id', 'name', 'role', 'defaultWeeklyHours'], order: [['name', 'ASC']]} ),
    Capacity.findAll( {order: [['date', 'ASC']]} ),
    WeeklyBudget.findAll(),
    AssistantAvailability.findAll( {order: [['date', 'ASC']]} ),
    GroutingDay.findAll( {attributes: ['id', 'date']} ),
  ] )

  return {
    users: users.map( u => u.toJSON() ),
    capacities: capacities.map( c => c.toJSON() ),
    weeklyBudgets: weeklyBudgets.map( w => w.toJSON() ),
    assistantAvailability: assistantAvailability.map( a => a.toJSON() ),
    groutingDays: groutingDays.map( g => g.toJSON() ),
  }
}

// Blank/null `hours` means "unset" (CONTEXT.md: an unset day is never
// treated as zero Capacity - it falls through to the fallback chain
// instead) and deletes any existing override. A real number, including
// `0`, is stored - 0 is a meaningful value (a deliberate day off), not
// the same as unset. Found live: the previous `!(numHours > 0)` check
// treated typing 0 the same as leaving the field blank, silently
// dropping it instead of storing a vacation-day override.
export async function upsertCapacity( userId, date, hours )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( null == hours || '' === hours )
  {
    await Capacity.destroy( {where: {userId, date}} )
  }
  else
  {
    const numHours = Number( hours )
    const [row] = await Capacity.findOrCreate( {where: {userId, date}, defaults: {hours: numHours}} )
    if( row.hours !== numHours )
      await row.update( {hours: numHours} )
  }

  await markAllOrdersScheduleStale()
  return {success: true}
}

// Unlike Capacity, a 0-hour assistant entry isn't a meaningful state to
// preserve (nobody "deliberately contributed zero hours") - removal is
// explicit, via deleteAssistantAvailability, so this just requires a
// real positive number.
export async function upsertAssistantAvailability( date, name, hours )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const trimmedName = (name || '').trim()
  const numHours = Number( hours )
  if( !trimmedName || !(numHours > 0) )
    return {error: 'Name and a positive number of hours are both required'}

  const [row] = await AssistantAvailability.findOrCreate( {where: {date, name: trimmedName}, defaults: {hours: numHours}} )
  if( row.hours !== numHours )
    await row.update( {hours: numHours} )

  await markAllOrdersScheduleStale()
  return {success: true}
}

export async function deleteAssistantAvailability( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  await AssistantAvailability.destroy( {where: {id}} )
  await markAllOrdersScheduleStale()

  return {success: true}
}
