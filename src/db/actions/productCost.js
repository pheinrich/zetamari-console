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
import { computeDefaultQuantities } from '@/libs/costFactors'

// Loads everything computeDefaultQuantities() needs to derive geometry-
// based defaults - just the substrateInfo branch of readProduct's eager
// include (product.js), re-fetched here rather than shared so this action
// stays independently callable (e.g. from a future router.refresh() in
// ProductCostEditor without round-tripping through the product page).
async function loadProductForCosting( id )
{
  return Product.findByPk( id, {
    include: [{
      association: 'substrateInfo',
      include: [
        {association: 'outside', include: [{association: 'shape'}]},
        {association: 'inside', include: [{association: 'shape'}]},
        {association: 'rabbet', include: [{association: 'shape'}]},
      ],
    }],
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
// product's live geometry/attributes), any manual override, and the $
// cost under both the wholesale and retail tiers the product actually
// prices under (its own custom profile if named, otherwise the standard
// one) - everything ProductCostEditor needs to render its table and
// totals in one round trip.
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

  const computed = computeDefaultQuantities( product.toJSON(), settings?.toJSON() )

  const rows = factors.map( factor => {
    const override = overrideByFactorId[factor.id]
    const computedQuantity = computed[factor.key] ?? 0
    const effectiveQuantity = override ? override.quantity : computedQuantity
    const wholesaleRate = wholesaleRateByFactorId[factor.id] ?? 0
    const retailRate = retailRateByFactorId[factor.id] ?? 0

    return {
      factor: factor.toJSON(),
      computedQuantity,
      overrideQuantity: override?.quantity ?? null,
      effectiveQuantity,
      wholesaleRate,
      retailRate,
      wholesaleCost: effectiveQuantity * wholesaleRate,
      retailCost: effectiveQuantity * retailRate,
    }
  } )

  return {
    rows,
    wholesaleProfileName: wholesaleProfile?.name ?? null,
    retailProfileName: retailProfile?.name ?? null,
    wholesaleTotal: rows.reduce( (sum, r) => sum + r.wholesaleCost, 0 ),
    retailTotal: rows.reduce( (sum, r) => sum + r.retailCost, 0 ),
  }
}

export async function setProductCostOverride( productId, costFactorId, quantity )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const [override] = await ProductCostOverride.findOrCreate({
    where: {productId, costFactorId},
    defaults: {quantity},
  })
  await override.update( {quantity} )

  return {success: true}
}

export async function revertProductCostOverride( productId, costFactorId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  await ProductCostOverride.destroy( {where: {productId, costFactorId}} )
  return {success: true}
}
