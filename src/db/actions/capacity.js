'use server'

import { unauthorized } from 'next/navigation'
import User from '@/db/models/User'
import Capacity from '@/db/models/Capacity'
import WeeklyBudget from '@/db/models/WeeklyBudget'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markAllOrdersScheduleStale } from '@/db/actions/scheduling'

// Every User (Owner/Assistant) plus every Capacity/WeeklyBudget row -
// the shared entry screen shows the whole near-term window at once
// (see CapacityPage.jsx for the window itself), so there's no date
// filter here; the row counts involved are tiny (a couple of users,
// at most a handful of weeks/day-overrides at a time).
export async function readSchedulingInputs()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [users, capacities, weeklyBudgets] = await Promise.all( [
    User.findAll( {attributes: ['id', 'name', 'role', 'defaultWeeklyHours'], order: [['name', 'ASC']]} ),
    Capacity.findAll( {order: [['date', 'ASC']]} ),
    WeeklyBudget.findAll(),
  ] )

  return {
    users: users.map( u => u.toJSON() ),
    capacities: capacities.map( c => c.toJSON() ),
    weeklyBudgets: weeklyBudgets.map( w => w.toJSON() ),
  }
}

// Blank/zero/negative `hours` means "unset" (CONTEXT.md: an unset week
// is never treated as zero Capacity - it falls through to the fallback
// chain instead), so it deletes any existing row rather than storing 0.
export async function upsertWeeklyBudget( userId, weekStartDate, hours )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const numHours = Number( hours )
  if( !(numHours > 0) )
  {
    await WeeklyBudget.destroy( {where: {userId, weekStartDate}} )
  }
  else
  {
    const [row] = await WeeklyBudget.findOrCreate( {where: {userId, weekStartDate}, defaults: {hours: numHours}} )
    if( row.hours !== numHours )
      await row.update( {hours: numHours} )
  }

  await markAllOrdersScheduleStale()
  return {success: true}
}

export async function upsertCapacity( userId, date, hours )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const numHours = Number( hours )
  if( !(numHours > 0) )
  {
    await Capacity.destroy( {where: {userId, date}} )
  }
  else
  {
    const [row] = await Capacity.findOrCreate( {where: {userId, date}, defaults: {hours: numHours}} )
    if( row.hours !== numHours )
      await row.update( {hours: numHours} )
  }

  await markAllOrdersScheduleStale()
  return {success: true}
}

export async function deleteCapacity( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  await Capacity.destroy( {where: {id}} )
  await markAllOrdersScheduleStale()

  return {success: true}
}
