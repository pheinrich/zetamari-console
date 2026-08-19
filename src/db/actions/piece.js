'use server'

import { unauthorized } from 'next/navigation'

import Customer from '@/db/models/Customer'
import GroutingDay from '@/db/models/GroutingDay'
import Order from '@/db/models/Order'
import Piece from '@/db/models/Piece'
import Product from '@/db/models/Product'
import Settings from '@/db/models/Settings'
import CostFactor from '@/db/models/CostFactor'
import ProductCostOverride from '@/db/models/ProductCostOverride'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { COSTING_INCLUDE } from '@/db/costingInclude'
import { getPhaseSequence, getPieceDurationHours } from '@/libs/pieceScheduling'
import { markOrdersScheduleStale, ensureProjectionsFresh } from '@/db/actions/scheduling'

// Order-level status the /production table filters on - not a stored
// column, derived fresh each read from what's already on hand. 'shipped'
// mirrors completedOn directly; a merely-packedOn order still reads as
// 'in-progress' (packed isn't shipped). 'new' means every one of the
// order's Pieces is still sitting untouched at its sequence's first
// phase (always 'Design' - see PHASE_SEQUENCES) - anything else that
// isn't shipped is 'in-progress'.
function orderStatus( order, orderPieces, productsById )
{
  if( order.completedOn )
    return 'shipped'

  const allAtFirstPhase = orderPieces.every( p => {
    const sequence = getPhaseSequence( productsById[p.productId] )

    return p.phase === sequence[0]
  } )

  return allAtFirstPhase ? 'new' : 'in-progress'
}

// Every open (not yet completed) order's Pieces, for the /production
// table - grouped/filtered/tabbed client-side. Both associations are
// declared directly on Piece.js, unlike OrderProduct's, so a plain eager
// include works here without the manual-join workaround order.js needs.
// ensureProjectionsFresh() first so each Order's promisedDate/
// promisedDateOrigin/groutingDayId are current, same as readOrders() -
// the grouting/ship-date columns would otherwise show stale projections.
// Each piece's flattened Order carries a computed `status` (see
// orderStatus() above), mirroring order.js's withAtRisk() pattern.
export async function readPiecesForProduction()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  await ensureProjectionsFresh()

  const pieces = await Piece.findAll( {
    include: [
      Product,
      {model: Order, where: {completedOn: null}, include: [Customer, GroutingDay]},
    ],
    order: [['id', 'ASC']],
  } )

  const piecesJson = pieces.map( p => p.toJSON() )
  const productsById = Object.fromEntries( piecesJson.map( p => [p.productId, p.Product] ) )

  const piecesByOrderId = {}

  for( const p of piecesJson )
    (piecesByOrderId[p.orderId] ??= []).push( p )

  return piecesJson.map( p => ({
    ...p,
    Order: {...p.Order, status: orderStatus( p.Order, piecesByOrderId[p.orderId], productsById )},
  }) )
}

// Shared setup for advancePieces()/revertPieces() - both need the same
// Pieces-by-id plus every product/settings/cost-factor lookup
// getPieceDurationHours() takes, just walk getPhaseSequence() in
// opposite directions. Returns null (rather than throwing) when there's
// nothing to do, so callers can early-return the same {advanced: 0}/
// {reverted: 0} shape without a redundant length check of their own.
async function loadPhaseWalkContext( pieceIds )
{
  if( !pieceIds?.length )
    return null

  const pieces = await Piece.findAll( {where: {id: pieceIds}} )

  if( 0 === pieces.length )
    return null

  const productIds = [...new Set( pieces.map( p => p.productId ) )]

  const [products, settings, costFactors, overrides] = await Promise.all( [
    Product.findAll( {where: {id: productIds}, include: COSTING_INCLUDE} ),
    Settings.findOne(),
    CostFactor.findAll(),
    ProductCostOverride.findAll( {where: {productId: productIds}} ),
  ] )

  const productsById = Object.fromEntries( products.map( p => [p.id, p.toJSON()] ) )
  const settingsJson = settings?.toJSON()
  const costFactorsByKey = Object.fromEntries( costFactors.map( f => [f.key, f.toJSON()] ) )

  const overrideByProductFactor = {}

  for( const o of overrides )
    (overrideByProductFactor[o.productId] ??= {})[o.costFactorId] = o.toJSON()

  return {pieces, productsById, settingsJson, costFactorsByKey, overrideByProductFactor}
}

// Moves each Piece to its next phase - walking getPhaseSequence() (kit
// vs finished, same as the recalculation engine) from its current phase
// forward one step, skipping *only* Glass when its getPieceDurationHours()
// is 0 (Q17 - the common case where nothing needs hand-cutting). Every
// other phase always gets its own click, even when its computed
// duration happens to be 0 (e.g. a product missing geometry/cost-factor
// configuration) - a 0-hour *estimate* isn't the same as "this
// production step doesn't happen," and treating it that way jumped
// straight to Finishing the moment any phase's duration was unknown.
// Found live: advancing a piece skipped everything after Design.
//
// simulateBacklog() (pieceScheduling.js) separately treats any 0-hour
// phase as instant for *timing* purposes - that's fine and unrelated
// to this: it never changes which phase value gets persisted, only how
// long the simulation spends on a phase it's just walking through in
// memory. This function is the only place phase state is written, so
// it's the only place "skip" has to mean "the step doesn't happen."
// A Piece already at (or past) the last real phase is left alone, not
// errored - reported via the returned `advanced` count instead, since a
// batch selection may legitimately mix pieces at different points in
// their own sequences.
export async function advancePieces( pieceIds )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const ctx = await loadPhaseWalkContext( pieceIds )

  if( !ctx )
    return {success: true, advanced: 0}

  let advanced = 0
  const affectedOrderIds = new Set()

  await sequelize.transaction( async t => {
    for( const piece of ctx.pieces )
    {
      const product = ctx.productsById[piece.productId]
      const sequence = getPhaseSequence( product )
      const currentIndex = sequence.indexOf( piece.phase )

      let nextIndex = currentIndex + 1

      while( nextIndex < sequence.length
        && 'Glass' === sequence[nextIndex]
        && 0 === getPieceDurationHours( sequence[nextIndex], product, ctx.settingsJson, ctx.costFactorsByKey, ctx.overrideByProductFactor[piece.productId] ) )
        nextIndex++

      if( nextIndex >= sequence.length )
        continue // already at the last real phase - nothing to advance to

      await piece.update( {phase: sequence[nextIndex]}, {transaction: t} )
      advanced++
      affectedOrderIds.add( piece.orderId )
    }
  } )

  await markOrdersScheduleStale( [...affectedOrderIds] )

  return {success: true, advanced}
}

// The mirror of advancePieces() - walks getPhaseSequence() one step
// *backward*, skipping back over a zero-duration Glass the same way
// Advance skips forward over it, and silently no-ops a Piece already at
// index 0 (Design) rather than erroring, for the same batch-selection
// reason advancePieces() no-ops at the end of the sequence.
export async function revertPieces( pieceIds )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const ctx = await loadPhaseWalkContext( pieceIds )

  if( !ctx )
    return {success: true, reverted: 0}

  let reverted = 0
  const affectedOrderIds = new Set()

  await sequelize.transaction( async t => {
    for( const piece of ctx.pieces )
    {
      const product = ctx.productsById[piece.productId]
      const sequence = getPhaseSequence( product )
      const currentIndex = sequence.indexOf( piece.phase )

      let prevIndex = currentIndex - 1

      while( prevIndex >= 0
        && 'Glass' === sequence[prevIndex]
        && 0 === getPieceDurationHours( sequence[prevIndex], product, ctx.settingsJson, ctx.costFactorsByKey, ctx.overrideByProductFactor[piece.productId] ) )
        prevIndex--

      if( prevIndex < 0 )
        continue // already at the first phase - nothing to revert to

      await piece.update( {phase: sequence[prevIndex]}, {transaction: t} )
      reverted++
      affectedOrderIds.add( piece.orderId )
    }
  } )

  await markOrdersScheduleStale( [...affectedOrderIds] )

  return {success: true, reverted}
}
