'use server'

import { unauthorized } from 'next/navigation'
import Order from '@/db/models/Order'
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import User from '@/db/models/User'
import Capacity from '@/db/models/Capacity'
import WeeklyBudget from '@/db/models/WeeklyBudget'
import GroutingDay from '@/db/models/GroutingDay'
import Settings from '@/db/models/Settings'
import CostFactor from '@/db/models/CostFactor'
import ProductCostOverride from '@/db/models/ProductCostOverride'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { COSTING_INCLUDE } from '@/db/costingInclude'
import { formatDateOnly, simulateBacklog } from '@/libs/pieceScheduling'

// The write-side half of docs/adr/0005's lazily-recomputed-cache
// pattern (same shape as productCost.js's markAllProductsCostStale()):
// flips scheduleStale on the given Orders so the next read triggers a
// fresh simulateBacklog() run, rather than recomputing inline here and
// making a routine write (a new order, a Piece phase change) block on a
// whole-backlog simulation.
export async function markOrdersScheduleStale( orderIds )
{
  if( !orderIds?.length )
    return

  await Order.update( {scheduleStale: true}, {where: {id: orderIds}} )
}

// Capacity/Weekly Budget edits affect the whole shared pool, not one
// order - every open order's projection depends on them, so a targeted
// id list (markOrdersScheduleStale above) isn't enough. Mirrors
// productCost.js's markAllProductsCostStale().
export async function markAllOrdersScheduleStale()
{
  await Order.update( {scheduleStale: true}, {where: {completedOn: null}} )
}

// The read-side half: if any open Order is scheduleStale, loads the
// full open backlog + every input simulateBacklog() needs, runs it
// once (whole-backlog - Projected Completion Date depends on every
// order competing for the same Capacity, not just the one being read),
// and persists the result. Called internally by order.js's readOrder()/
// readOrders() - never by a write action directly, so a single Capacity
// edit doesn't block on a full-backlog simulation.
export async function ensureProjectionsFresh()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const staleCount = await Order.count( {where: {completedOn: null, scheduleStale: true}} )
  if( 0 === staleCount )
    return

  const [orders, pieces, products, users, capacities, weeklyBudgets, groutingDays, settings, costFactors, overrides] = await Promise.all( [
    Order.findAll( {where: {completedOn: null}} ),
    Piece.findAll(),
    Product.findAll( {include: COSTING_INCLUDE} ),
    User.findAll( {attributes: ['id', 'role', 'defaultWeeklyHours']} ),
    Capacity.findAll(),
    WeeklyBudget.findAll(),
    GroutingDay.findAll(),
    Settings.findOne(),
    CostFactor.findAll(),
    ProductCostOverride.findAll(),
  ] )

  const productsById = Object.fromEntries( products.map( p => [p.id, p.toJSON()] ) )
  const todayStr = formatDateOnly( new Date() )

  const results = simulateBacklog( {
    orders: orders.map( o => o.toJSON() ),
    pieces: pieces.map( p => p.toJSON() ),
    productsById,
    users: users.map( u => u.toJSON() ),
    capacities: capacities.map( c => c.toJSON() ),
    weeklyBudgets: weeklyBudgets.map( w => w.toJSON() ),
    groutingDays: groutingDays.map( g => g.toJSON() ),
    settingsJson: settings?.toJSON(),
    costFactors: costFactors.map( f => f.toJSON() ),
    overrides: overrides.map( o => o.toJSON() ),
    todayStr,
  } )

  await sequelize.transaction( async t => {
    for( const result of results )
    {
      let groutingDayId = null

      if( result.groutingDay )
      {
        if( result.groutingDay.id )
        {
          groutingDayId = result.groutingDay.id
        }
        else
        {
          // Newly computed by this run - persist it (or pick up a row
          // another order in this same batch already created for the
          // same date, matching the "one Grouting Day, many orders"
          // relationship - see GroutingDay.js).
          const [groutingDay] = await GroutingDay.findOrCreate( {
            where: {date: result.groutingDay.date},
            defaults: {origin: 'computed'},
            transaction: t,
          } )
          groutingDayId = groutingDay.id
        }
      }

      await Order.update(
        {
          projectedCompletionDate: result.projectedCompletionDate,
          promisedDate: result.promisedDate,
          promisedDateOrigin: result.promisedDateOrigin,
          groutingDayId,
          scheduleStale: false,
        },
        {where: {id: result.orderId}, transaction: t}
      )
    }
  } )
}
