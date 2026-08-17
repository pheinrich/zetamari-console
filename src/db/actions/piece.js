'use server'

import { unauthorized } from 'next/navigation'
import Customer from '@/db/models/Customer'
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
import { markOrdersScheduleStale } from '@/db/actions/scheduling'

// Every open (not yet completed) order's Pieces, for the production
// board - grouped by phase client-side. Both associations are declared
// directly on Piece.js, unlike OrderProduct's, so a plain eager include
// works here without the manual-join workaround order.js needs.
export async function readPiecesForBoard()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const pieces = await Piece.findAll( {
    include: [
      Product,
      {model: Order, where: {completedOn: null}, include: [Customer]},
    ],
    order: [['id', 'ASC']],
  } )

  return pieces.map( p => p.toJSON() )
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

  if( !pieceIds?.length )
    return {success: true, advanced: 0}

  const pieces = await Piece.findAll( {where: {id: pieceIds}} )
  if( 0 === pieces.length )
    return {success: true, advanced: 0}

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

  let advanced = 0
  const affectedOrderIds = new Set()

  await sequelize.transaction( async t => {
    for( const piece of pieces )
    {
      const product = productsById[piece.productId]
      const sequence = getPhaseSequence( product )
      const currentIndex = sequence.indexOf( piece.phase )

      let nextIndex = currentIndex + 1
      while( nextIndex < sequence.length
        && 'Glass' === sequence[nextIndex]
        && 0 === getPieceDurationHours( sequence[nextIndex], product, settingsJson, costFactorsByKey, overrideByProductFactor[piece.productId] ) )
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
