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
// derive geometry- and BOM-based defaults - the woodenBaseInfo branch of
// readProduct's eager include (product.js) for geometry, plus bomLines
// with each material's type (to know which area-based factor, if any, it
// supersedes) and supplier prices (to cost the "bom" factor), plus each
// material's own `weight` (for computeProductWeight()'s BOM-weight sum
// below - readProduct's own eager include doesn't need this, only
// costing does). Shared by loadProductForCosting (one product) and
// readProductsCogsCosts (every product at once, for the list page's Cost
// column).
const COSTING_INCLUDE = [
  {
    association: 'woodenBaseInfo',
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

// Which Settings weight-per-sqin constant a Material CostFactor's
// computed area converts to weight with - see the
// 20260723030000-settings-weight-per-sqin.js migration. Only the four
// area-based Material factors have a physical weight to speak of; 'bom'
// is a $ pass-through (its BOM lines' own weight is summed separately -
// see sumEffectiveWeight() below), and Machine/Labor factors aren't
// materials at all.
const MATERIAL_WEIGHT_FIELD = {
  tesserae: 'tesseraeWeightPerSqIn',
  mirrorGlass: 'mirrorGlassWeightPerSqIn',
  grout: 'groutWeightPerSqIn',
  woodenBase: 'woodenBaseWeightPerSqIn',
}

// The two CostFactor rows added by the 20260725000000-owner-assistant-
// labor.js migration (item 13) - see CostFactor.js's doc comment. They
// hold a shop-wide $/hr rate each (edited via the same Settings page
// table as every other factor), but unlike every other factor, they
// have no computed quantity of their own and never appear as their own
// row in a product's cost breakdown - see computeLaborSplit() below,
// which is the only place they're read (by key, for their `rate`).
const LABOR_RATE_KEYS = { owner: 'laborOwner', assistant: 'laborAssistant' }

function resolveLaborRates( factors )
{
  return {
    ownerRate: factors.find( f => f.key === LABOR_RATE_KEYS.owner )?.rate ?? 0,
    assistantRate: factors.find( f => f.key === LABOR_RATE_KEYS.assistant )?.rate ?? 0,
  }
}

// Per-stage Owner/Assistant cost split for every Labor stage factor
// (Design/CNC/Sanding/Glueing/Grouting/Finishing - `laborStageFactors`
// is every 'labor' category CostFactor except the two rate-holders
// above). Each stage's own computed/overridable *time* is entirely
// unchanged from before item 13 (see libs/costFactors.js's
// computeDefaultQuantities() - still geometry/flat-rate derived, still
// overridable via ProductCostOverride.quantityOverride/enabledOverride);
// what's new is `effectiveOwnerSharePercent` (0-100), which decides how
// much of that stage's time bills at `ownerRate` versus `assistantRate` -
// CostFactor.defaultOwnerSharePercent shop-wide, overridable per-product
// per-stage via ProductCostOverride.ownerShareOverride.
//
// Every row is computed in full regardless of effectiveEnabled (same
// convention as the Material/Machine rows in readProductCosts() below -
// a superseded/disabled factor still shows its own $ figures, only the
// *totals* exclude it), which is why `ownerTotal`/`assistantTotal` are
// filtered here rather than the per-row values being zeroed.
function computeLaborSplit( productJson, settingsJson, laborStageFactors, overrideByFactorId, ownerRate, assistantRate )
{
  const computed = computeDefaultQuantities( productJson, settingsJson )

  const rows = laborStageFactors.map( factor => {
    const override = overrideByFactorId[factor.id]

    const rawComputedQuantity = computed[factor.key] ?? 0
    const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
    const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
    const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : true

    const computedOwnerSharePercent = factor.defaultOwnerSharePercent ?? 100
    const effectiveOwnerSharePercent = null != override?.ownerShareOverride ? override.ownerShareOverride : computedOwnerSharePercent

    const hours = convertToRateUnit( effectiveQuantity, factor )
    const ownerCost = hours * (effectiveOwnerSharePercent / 100) * ownerRate
    const assistantCost = hours * (1 - effectiveOwnerSharePercent / 100) * assistantRate

    return {
      factor,
      override,
      computedQuantity,
      effectiveQuantity,
      effectiveEnabled,
      computedOwnerSharePercent,
      effectiveOwnerSharePercent,
      ownerCost,
      assistantCost,
    }
  } )

  const ownerTotal = rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.ownerCost, 0 )
  const assistantTotal = rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.assistantCost, 0 )

  return { ownerTotal, assistantTotal, rows }
}

// Re-fetched here rather than shared with readProduct so this action
// stays independently callable (e.g. from router.refresh() in
// ProductCostEditor without round-tripping through the product page).
async function loadProductForCosting( id )
{
  return Product.findByPk( id, {include: COSTING_INCLUDE} )
}

// The product's COGS total, per item 13's formula:
//   COGS = (Material + Machine cost) x materialsMarkup + assistant labor cost
// `factors` is every CostFactor; `overrideByFactorId` is this one
// product's overrides keyed by costFactorId. Factored out so
// readProductsCogsCosts() can reuse it without pulling in
// readProductCosts()'s full per-row breakdown shape (which is built for
// the product detail page's table, not a single number).
//
// Labor is deliberately excluded from the Material+Machine loop below -
// see computeLaborSplit() - since it's the assistant-only portion that
// counts toward COGS (owner labor only enters at the Wholesale step -
// see readProductCosts()).
function sumEffectiveCost( productJson, settingsJson, factors, overrideByFactorId )
{
  const computed = computeDefaultQuantities( productJson, settingsJson )
  const superseded = computeSupersededFactors( productJson )
  const materialsMarkup = settingsJson?.wholesaleMultiplier ?? 1

  let materialMachineCost = 0
  for( const factor of factors )
  {
    if( 'material' !== factor.category && 'machine' !== factor.category )
      continue

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

    materialMachineCost += convertToRateUnit( effectiveQuantity, factor ) * (factor.rate ?? 0)
  }

  const laborStageFactors = factors.filter( f => 'labor' === f.category && !Object.values( LABOR_RATE_KEYS ).includes( f.key ) )
  const { ownerRate, assistantRate } = resolveLaborRates( factors )
  const { assistantTotal } = computeLaborSplit( productJson, settingsJson, laborStageFactors, overrideByFactorId, ownerRate, assistantRate )

  return materialMachineCost * materialsMarkup + assistantTotal
}

// Same effective-quantity/effective-enabled math as sumEffectiveCost()
// above, but summing weight instead of $ - only over the four area-based
// Material factors MATERIAL_WEIGHT_FIELD knows a weight-per-sqin
// constant for (everything else contributes nothing here), plus each BOM
// line's own quantity x material.weight, unconditionally. BOM lines
// aren't gated by a factor's enabled/superseded state the way their $
// cost is: a superseded factor (e.g. mirrorGlass once a real glass BOM
// line exists) is excluded here for the same reason it's excluded from
// cogsTotal - counting both the BOM line's own weight *and* the
// generic area-based estimate would double the same physical material's
// weight.
function sumEffectiveWeight( productJson, settingsJson, factors, overrideByFactorId )
{
  const computed = computeDefaultQuantities( productJson, settingsJson )
  const superseded = computeSupersededFactors( productJson )

  let total = 0
  for( const factor of factors )
  {
    const weightField = MATERIAL_WEIGHT_FIELD[factor.key]
    if( !weightField )
      continue

    const override = overrideByFactorId[factor.id]
    const rawComputedQuantity = computed[factor.key] ?? 0
    const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
    const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
    const computedEnabled = !superseded.has( factor.key )
    const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : computedEnabled

    if( !effectiveEnabled )
      continue

    total += effectiveQuantity * (settingsJson?.[weightField] ?? 0)
  }

  for( const line of productJson?.bomLines ?? [] )
    total += (line.quantity || 0) * (line.material?.weight ?? 0)

  return total
}

// The computed material weight for a product - BOM lines' own weight
// plus its area-based Material factors' weight (see sumEffectiveWeight()
// above) - for ProductForm.jsx's "Compute Weight" button to fill
// Product.weight from. Deliberately not written back automatically:
// weight stays an independent, manually-entered figure (like
// priceWholesale/priceRetail), so a later BOM/geometry change doesn't
// silently drift a value someone may have already overridden by hand.
export async function readProductWeight( productId )
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
    CostFactor.findAll(),
    ProductCostOverride.findAll( {where: {productId}} ),
  ])

  const overrideByFactorId = Object.fromEntries( overrides.map( o => [o.costFactorId, o] ) )

  return sumEffectiveWeight( product.toJSON(), settings?.toJSON(), factors, overrideByFactorId )
}

// Combines, per cost factor: the computed default quantity (from the
// product's live geometry/BOM), any manual overrides, and the $ cost at
// COGS/Wholesale/Retail - everything ProductCostEditor needs to render
// its table and totals in one round trip. Rows for a factor superseded
// by a real BOM line (or manually unchecked) still carry their full
// computed $ figures, so the estimate stays visible for comparison -
// only the totals exclude them.
//
// As of item 13 (20260725000000-owner-assistant-labor.js), Material and
// Machine rows are priced one way and Labor stage rows another - see
// Settings.js's doc comment for the full formula. In short:
//   - Material/Machine row: cogsCost = quantity x rate x materialsMarkup
//     (the markup is baked into "cogsCost" itself, per the shop's own
//     definition of COGS); wholesaleCost is the same figure (materials
//     don't get marked up again between COGS and Wholesale); retailCost
//     = wholesaleCost x retailMultiplier.
//   - Labor stage row: cogsCost = its Assistant-attributed cost only
//     (Owner labor isn't part of COGS); wholesaleCost = Assistant +
//     Owner cost combined (Owner labor is what turns COGS into
//     Wholesale); retailCost = wholesaleCost x retailMultiplier.
// Summing cogsCost/wholesaleCost/retailCost across every enabled row
// therefore reproduces exactly: COGS = (materials+machine) x
// materialsMarkup + assistant labor; Wholesale = COGS + owner labor;
// Retail = Wholesale x retailMultiplier.
//
// The two rate-holder factors ('laborOwner'/'laborAssistant' - see
// CostFactor.js) never appear in `rows` - they have no quantity of
// their own and are only consulted (via resolveLaborRates()) for their
// $/hr rate.
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
  // Field names unchanged from before item 13 (see Settings.js) - only
  // what they multiply against has changed.
  const materialsMarkup = settings?.wholesaleMultiplier ?? 1
  const retailMultiplier = settings?.retailMultiplier ?? 1

  const productJson = product.toJSON()
  const settingsJson = settings?.toJSON()
  const computed = computeDefaultQuantities( productJson, settingsJson )
  const superseded = computeSupersededFactors( productJson )

  const materialMachineFactors = factors.filter( f => 'material' === f.category || 'machine' === f.category )
  const laborStageFactors = factors.filter( f => 'labor' === f.category && !Object.values( LABOR_RATE_KEYS ).includes( f.key ) )
  const { ownerRate, assistantRate } = resolveLaborRates( factors )

  const materialMachineRows = materialMachineFactors.map( factor => {
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

    const rateQuantity = convertToRateUnit( effectiveQuantity, factor )
    const cogsCost = rateQuantity * (factor.rate ?? 0) * materialsMarkup

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
      wholesaleCost: cogsCost,
      retailCost: cogsCost * retailMultiplier,
    }
  } )

  const { rows: laborRowsRaw } = computeLaborSplit( productJson, settingsJson, laborStageFactors, overrideByFactorId, ownerRate, assistantRate )

  const laborRows = laborRowsRaw.map( r => {
    const cogsCost = r.assistantCost
    const wholesaleCost = r.assistantCost + r.ownerCost

    return {
      factor: r.factor.toJSON(),
      computedQuantity: r.computedQuantity,
      overrideQuantity: r.override?.quantityOverride ?? null,
      effectiveQuantity: r.effectiveQuantity,
      computedEnabled: true,
      enabledOverride: r.override?.enabledOverride ?? null,
      effectiveEnabled: r.effectiveEnabled,
      computedOwnerSharePercent: r.computedOwnerSharePercent,
      overrideOwnerSharePercent: r.override?.ownerShareOverride ?? null,
      effectiveOwnerSharePercent: r.effectiveOwnerSharePercent,
      cogsRate: null,
      cogsCost,
      wholesaleCost,
      retailCost: wholesaleCost * retailMultiplier,
    }
  } )

  const rows = [...materialMachineRows, ...laborRows]
  const enabledRows = rows.filter( r => r.effectiveEnabled )

  return {
    rows,
    wholesaleMultiplier: materialsMarkup,
    retailMultiplier,
    ownerLaborCost: laborRows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + (r.wholesaleCost - r.cogsCost), 0 ),
    assistantLaborCost: laborRows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.cogsCost, 0 ),
    cogsTotal: enabledRows.reduce( (sum, r) => sum + r.cogsCost, 0 ),
    wholesaleTotal: enabledRows.reduce( (sum, r) => sum + r.wholesaleCost, 0 ),
    retailTotal: enabledRows.reduce( (sum, r) => sum + r.retailCost, 0 ),
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
    // One product with bad/incomplete geometry (a malformed svgData
    // field, an unrecognized shape key, etc.) shouldn't take the whole
    // list page down for every other product - log and fall back to
    // null (rendered as "-" rather than a misleading $0) so the rest of
    // the table still loads.
    try
    {
      totals[product.id] = sumEffectiveCost( product.toJSON(), settingsJson, factors, overrideByFactorId )
    }
    catch( err )
    {
      console.error( `readProductsCogsCosts: failed to cost product ${product.id}`, err )
      totals[product.id] = null
    }
  }

  return totals
}

// A row is only kept around while at least one of the three overridable
// fields is actually set - see ProductCostOverride.js.
async function deleteIfEmpty( override )
{
  if( null == override.quantityOverride && null == override.enabledOverride && null == override.ownerShareOverride )
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

// The third overridable field (see ProductCostOverride.js) - only
// meaningful for a Labor stage factor (Design/CNC/Sanding/Glueing/
// Grouting/Finishing), overriding CostFactor.defaultOwnerSharePercent
// for this one product. `percent` is 0-100.
export async function setProductCostOwnerShare( productId, costFactorId, percent )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [override] = await ProductCostOverride.findOrCreate({
    where: {productId, costFactorId},
    defaults: {ownerShareOverride: percent},
  })
  await override.update( {ownerShareOverride: percent} )

  return {success: true}
}

export async function revertProductCostOwnerShare( productId, costFactorId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const override = await ProductCostOverride.findOne( {where: {productId, costFactorId}} )
  if( !override )
    return {success: true}

  await override.update( {ownerShareOverride: null} )
  await deleteIfEmpty( override )

  return {success: true}
}
