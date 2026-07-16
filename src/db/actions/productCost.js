'use server'

import { notFound, unauthorized } from 'next/navigation'
import Product from '@/db/models/Product'
import CostFactor from '@/db/models/CostFactor'
import ProductCostOverride from '@/db/models/ProductCostOverride'
import RateProfile from '@/db/models/RateProfile'
import ProfileRate from '@/db/models/ProfileRate'
import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { computeDefaultQuantities, computeSupersededFactors, convertToRateUnit } from '@/libs/costFactors'

// Loads everything computeDefaultQuantities()/computeSupersededFactors()
// need to derive geometry- and BOM-based defaults - the substrateInfo
// branch of readProduct's eager include (product.js) for geometry, plus
// bomLines with each material's type (to know which area-based factor,
// if any, it supersedes) and supplier prices (to cost the "bom" factor).
// Re-fetched here rather than shared with readProduct so this action
// stays independently callable (e.g. from router.refresh() in
// ProductCostEditor without round-tripping through the product page).
async function loadProductForCosting( id )
{
  return Product.findByPk( id, {
    include: [
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
    ],
  })
}

// Every product implicitly prices under the standard Wholesale/Retail
// profiles unless it names a custom one - see Product.wholesaleRateProfileId/
// retailRateProfileId.
async function resolveEffectiveProfileId( product, kind )
{
  const explicitId = 'wholesale' === kind ? product.wholesaleRateProfileId : product.retailRateProfileId
  if( explicitId )
    return explicitId

  const standard = await RateProfile.findOne( {where: {kind}} )
  return standard?.id
}

// Combines, per cost factor: the computed default quantity (from the
// product's live geometry/BOM), any manual quantity/enabled overrides,
// and the $ cost under both the wholesale and retail tiers the product
// actually prices under (its own custom profile if named, otherwise the
// standard one) - everything ProductCostEditor needs to render its
// table and totals in one round trip. Rows for a factor superseded by a
// real BOM line (or manually unchecked) still carry their full computed
// $ figures, so the estimate stays visible for comparison - only the
// totals exclude them.
export async function readProductCosts( productId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await loadProductForCosting( productId )
  if( !product )
    notFound()

  const [settings, factors, overrides, wholesaleProfileId, retailProfileId] = await Promise.all([
    Settings.findOne(),
    CostFactor.findAll( {order: [['id', 'ASC']]} ),
    ProductCostOverride.findAll( {where: {productId}} ),
    resolveEffectiveProfileId( product, 'wholesale' ),
    resolveEffectiveProfileId( product, 'retail' ),
  ])

  const [wholesaleProfile, retailProfile] = await Promise.all([
    wholesaleProfileId ? RateProfile.findByPk( wholesaleProfileId, {include: [{model: ProfileRate, as: 'rates'}]} ) : null,
    retailProfileId ? RateProfile.findByPk( retailProfileId, {include: [{model: ProfileRate, as: 'rates'}]} ) : null,
  ])

  const wholesaleRateByFactorId = Object.fromEntries( (wholesaleProfile?.rates || []).map( r => [r.costFactorId, r.rate] ) )
  const retailRateByFactorId = Object.fromEntries( (retailProfile?.rates || []).map( r => [r.costFactorId, r.rate] ) )
  const overrideByFactorId = Object.fromEntries( overrides.map( o => [o.costFactorId, o] ) )

  const productJson = product.toJSON()
  const computed = computeDefaultQuantities( productJson, settings?.toJSON() )
  const superseded = computeSupersededFactors( productJson )

  const rows = factors.map( factor => {
    const override = overrideByFactorId[factor.id]
    const computedQuantity = computed[factor.key] ?? 0
    const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
    const wholesaleRate = wholesaleRateByFactorId[factor.id] ?? 0
    const retailRate = retailRateByFactorId[factor.id] ?? 0
    const computedEnabled = !superseded.has( factor.key )
    const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : computedEnabled

    // Rates are quoted per factor.rateUnit (defaulting to factor.unit),
    // which for Labor factors is hours even though the quantity itself
    // is tracked in minutes - convert before multiplying so the $
    // figures come out right.
    const rateQuantity = convertToRateUnit( effectiveQuantity, factor )

    return {
      factor: factor.toJSON(),
      computedQuantity,
      overrideQuantity: override?.quantityOverride ?? null,
      effectiveQuantity,
      computedEnabled,
      enabledOverride: override?.enabledOverride ?? null,
      effectiveEnabled,
      wholesaleRate,
      retailRate,
      wholesaleCost: rateQuantity * wholesaleRate,
      retailCost: rateQuantity * retailRate,
    }
  } )

  return {
    rows,
    wholesaleProfileName: wholesaleProfile?.name ?? null,
    retailProfileName: retailProfile?.name ?? null,
    wholesaleTotal: rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.wholesaleCost, 0 ),
    retailTotal: rows.filter( r => r.effectiveEnabled ).reduce( (sum, r) => sum + r.retailCost, 0 ),
  }
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
