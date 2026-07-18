'use server'

import { notFound, unauthorized } from 'next/navigation'
import Product from '@/db/models/Product'
import CostFactor from '@/db/models/CostFactor'
import ProductCostOverride from '@/db/models/ProductCostOverride'
import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { computeDefaultQuantities, computeSupersededFactors, convertToRateUnit } from '@/libs/costFactors'

// What computeDefaultQuantities()/computeSupersededFactors() need to
// derive geometry- and BOM-based defaults - the substrateInfo branch of
// readProduct's eager include (product.js) for geometry, plus bomLines
// with each material's type (to know which area-based factor, if any, it
// supersedes) and supplier prices (to cost the "bom" factor). Shared by
// loadProductForCosting (one product) and readProductsCogsCosts (every
// product at once, for the list page's Cost column).
const COSTING_INCLUDE = [
  {
    association: 'substrateInfo',
    include: [
      {association: 'outside', include: [{association: 'shape'}]},
      {association: 'inside', include: [{association: 'shape'}]},
      {association: 'rabbet', include: [{association: 'shape'}]},
    ],
  },
  {
    association: 'bomLines',
    include: [{
      association: 'material',
      include: [{association: 'suppliers', through: {attributes: ['cost']}}],
    }],
  },
]

// Re-fetched here rather than shared with readProduct so this action
// stays independently callable (e.g. from router.refresh() in
// ProductCostEditor without round-tripping through the product page).
async function loadProductForCosting( id )
{
  return Product.findByPk( id, {include: COSTING_INCLUDE} )
}

// The same per-factor effective-quantity/effective-enabled math
// readProductCosts() uses to build its rows below, factored out so
// readProductsCogsCosts() can reuse it without pulling in
// readProductCosts()'s full per-row breakdown shape (which is built for
// the product detail page's table, not a single number). `factors` is
// every CostFactor (each carrying its own $/unit `rate` - see
// CostFactor.js); `overrideByFactorId` is this one product's overrides
// keyed by costFactorId.
function sumEffectiveCost( productJson, settingsJson, factors, overrideByFactorId )
{
  const computed = computeDefaultQuantities( productJson, settingsJson )
  const superseded = computeSupersededFactors( productJson )

  let total = 0
  for( const factor of factors )
  {
    const override = overrideByFactorId[factor.id]

    // `?? 0` alone doesn't catch NaN (only null/undefined) - see the
    // same guard in readProductCosts() below.
    const rawComputedQuantity = computed[factor.key] ?? 0
    const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
    const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
    const computedEnabled = !superseded.has( factor.key )
    const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : computedEnabled

    if( !effectiveEnabled )
      continue

    total += convertToRateUnit( effectiveQuantity, factor ) * (factor.rate ?? 0)
  }

  return total
}

// Combines, per cost factor: the computed default quantity (from the
// product's live geometry/BOM), any manual quantity/enabled overrides,
// and the $ cost at COGS plus the Wholesale/Retail figures derived from
// it via Settings.wholesaleMultiplier/retailMultiplier - everything
// ProductCostEditor needs to render its table and totals in one round
// trip. Rows for a factor superseded by a real BOM line (or manually
// unchecked) still carry their full computed $ figures, so the estimate
// stays visible for comparison - only the totals exclude them.
export async function readProductCosts( productId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await loadProductForCosting( productId )
  if( !product )
    notFound()

  const [settings, factors, overrides] = await Promise.all([
    Settings.findOne(),
    CostFactor.findAll( {order: [['id', 'ASC']]} ),
    ProductCostOverride.findAll( {where: {productId}} ),
  ])

  const overrideByFactorId = Object.fromEntries( overrides.map( o => [o.costFactorId, o] ) )
  const wholesaleMultiplier = settings?.wholesaleMultiplier ?? 1
  const retailMultiplier = settings?.retailMultiplier ?? 1

  const productJson = product.toJSON()
  const computed = computeDefaultQuantities( productJson, settings?.toJSON() )
  const superseded = computeSupersededFactors( productJson )

  const rows = factors.map( factor => {
    const override = overrideByFactorId[factor.id]
    // `?? 0` alone doesn't catch NaN (only null/undefined) - guard
    // explicitly so a bad geometry formula can't leak NaN into the
    // effective quantity/cost figures below, which would otherwise
    // silently show "NaN" in the breakdown and hard-fail zod validation
    // wherever this gets submitted as a value (e.g. the Duplicate flow's
    // costOverrides snapshot in ProductForm.jsx).
    const rawComputedQuantity = computed[factor.key] ?? 0
    const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
    const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
    const computedEnabled = !superseded.has( factor.key )
    const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : computedEnabled

    // Rates are quoted per factor.rateUnit (defaulting to factor.unit),
    // which for Labor factors is hours even though the quantity itself
    // is tracked in minutes - convert before multiplying so the $
    // figures come out right.
    const rateQuantity = convertToRateUnit( effectiveQuantity, factor )
    const cogsCost = rateQuantity * (factor.rate ?? 0)

    return {
      factor: factor.toJSON(),
      computedQuantity,
      overrideQuantity: override?.quantityOverride ?? null,
      effectiveQuantity,
      computedEnabled,
      enabledOverride: override?.enabledOverride ?? null,
      effectiveEnabled,
      cogsRate: factor.rate ?? 0,
      cogsCost,
      wholesaleCost: cogsCost * wholesaleMultiplier,
      retailCost: cogsCost * retailMultiplier,
    }
  } )

  return {
    rows,
    wholesaleMultiplier,
    retailMultiplier,
    cogsTotal: rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.cogsCost, 0 ),
    wholesaleTotal: rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.wholesaleCost, 0 ),
    retailTotal: rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.retailCost, 0 ),
  }
}

// Every product's COGS ("Cost of Goods Sold") total, for the Products
// list page's Cost column - CostFactor.rate is the one shop-wide $/unit
// rate per factor now (see the 20260722000000-simplify-cost-profiles.js
// migration), so there's no per-product/per-tier profile resolution
// needed here at all.
//
// Deliberately batched rather than calling readProductCosts() once per
// product: that function alone runs several queries (including a multi-
// table eager load) *per call*, which would make a list of even a few
// dozen products run into the hundreds of queries. Here, Settings/
// CostFactors are each fetched once, every product's costing inputs and
// every ProductCostOverride row are fetched in one query apiece, and the
// per-product $ math (sumEffectiveCost) runs entirely in JS from there -
// a constant number of queries no matter how many products exist.
export async function readProductsCogsCosts()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [settings, factors, overrides, products] = await Promise.all([
    Settings.findOne(),
    CostFactor.findAll(),
    ProductCostOverride.findAll(),
    Product.findAll( {include: COSTING_INCLUDE} ),
  ])

  const settingsJson = settings?.toJSON()

  const overridesByProductId = {}
  for( const override of overrides )
    (overridesByProductId[override.productId] ??= {})[override.costFactorId] = override

  const totals = {}
  for( const product of products )
  {
    const overrideByFactorId = overridesByProductId[product.id] || {}
    totals[product.id] = sumEffectiveCost( product.toJSON(), settingsJson, factors, overrideByFactorId )
  }

  return totals
}

// A row is only kept around while at least one of the two overridable
// fields is actually set - see ProductCostOverride.js.
async function deleteIfEmpty( override )
{
  if( null == override.quantityOverride && null == override.enabledOverride )
    await override.destroy()
}

export async function setProductCostOverride( productId, costFactorId, quantity )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [override] = await ProductCostOverride.findOrCreate({
    where: {productId, costFactorId},
    defaults: {quantityOverride: quantity},
  })
  await override.update( {quantityOverride: quantity} )

  return {success: true}
}

export async function revertProductCostOverride( productId, costFactorId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const override = await ProductCostOverride.findOne( {where: {productId, costFactorId}} )
  if( !override )
    return {success: true}

  await override.update( {quantityOverride: null} )
  await deleteIfEmpty( override )

  return {success: true}
}

export async function setProductCostFactorEnabled( productId, costFactorId, enabled )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [override] = await ProductCostOverride.findOrCreate({
    where: {productId, costFactorId},
    defaults: {enabledOverride: enabled},
  })
  await override.update( {enabledOverride: enabled} )

  return {success: true}
}

export async function revertProductCostFactorEnabled( productId, costFactorId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const override = await ProductCostOverride.findOne( {where: {productId, costFactorId}} )
  if( !override )
    return {success: true}

  await override.update( {enabledOverride: null} )
  await deleteIfEmpty( override )

  return {success: true}
}
