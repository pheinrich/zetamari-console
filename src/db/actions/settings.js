'use server'

import CostFactor from '@/db/models/CostFactor'
import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Settings is a singleton table - readSettings/updateSettings always
// operate on the first (and only) row, creating it on first write if it
// doesn't exist yet. Backs the company name/logo used on printed
// calculator reports (see calculator/report/ReportOptionsPanel.jsx), the
// shop process constants the cost-profile system's computed default
// quantities are derived from (see libs/costFactors.js) - feed rate/power
// draw/electricity rate and the sanding/glueing/grouting sq-in/hr
// throughput constants - wholesaleMultiplier/retailMultiplier, which
// scale a product's COGS cost total into its Wholesale/Retail figures
// (see db/actions/productCost.js) - and the four *WeightPerSqIn
// constants, which do the same for computeProductWeight()'s weight
// figure instead of $.
const NUMERIC_FIELDS = [
  'feedRateInPerMin',
  'powerDrawKwh',
  'electricityRatePerKwh',
  'sandingRateSqInPerHr',
  'glueingRateSqInPerHr',
  'groutingRateSqInPerHr',
  'wholesaleMultiplier',
  'retailMultiplier',
  'tesseraeWeightPerSqIn',
  'mirrorGlassWeightPerSqIn',
  'groutWeightPerSqIn',
  'woodenBaseWeightPerSqIn',
]

export async function readSettings()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const settings = await Settings.findOne()

  return settings?.toJSON() ?? {companyName: '', logoUrl: ''}
}

// Unlike the other NUMERIC_FIELDS (which are nullable - "not yet
// configured" is a meaningful, distinct state from 0), the multiplier
// columns are `allowNull: false` with a default of 1 (see Settings.js) -
// a blank multiplier field falls back to 1 ("no markup"), not null.
const MULTIPLIER_FIELDS = new Set( ['wholesaleMultiplier', 'retailMultiplier'] )

export async function updateSettings( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const [settings] = await Settings.findOrCreate( {where: {}, defaults: {}} )

  const update = {
    companyName: data.companyName || null,
    logoUrl: data.logoUrl || null,
  }

  // Only touch a numeric field if the caller actually included it - lets
  // ReportOptionsPanel's branding-only save keep calling this with just
  // {companyName, logoUrl} without wiping out the process constants.
  for( const field of NUMERIC_FIELDS )
    if( field in data )
    {
      const blank = null == data[field] || '' === data[field]
      update[field] = blank ? (MULTIPLIER_FIELDS.has( field ) ? 1 : null) : Number( data[field] )
    }

  await settings.update( update )

  return settings.toJSON()
}

// --- Cost factor rates ---------------------------------------------------
//
// CostFactor.rate is the one $/unit COGS rate per factor, shop-wide -
// folded in here (rather than kept as a separate RateProfile/ProfileRate
// system) since it's the same kind of shop-wide constant as the process
// constants above, not per-product data. See the 20260722000000-simplify-
// cost-profiles.js migration and libs/costFactors.js.

export async function readCostFactors()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const factors = await CostFactor.findAll( {order: [['id', 'ASC']]} )
  return factors.map( f => f.toJSON() )
}

// `rates` is an array of {id, rate, defaultOwnerSharePercent} - every
// factor's rate is saved in one call, matching how the rest of this page
// submits its whole form at once rather than one field at a time.
// `defaultOwnerSharePercent` (see CostFactor.js/the
// 20260725000000-owner-assistant-labor.js migration) is only submitted
// for the six Labor stage factors (SettingsForm.jsx doesn't render that
// input for anything else, including the two laborOwner/laborAssistant
// rate-holder rows) - left untouched here when absent, so a plain rate
// edit on a Material/Machine factor doesn't need to carry a meaningless
// null through for every row.
export async function updateCostFactorRates( rates )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()

  for( const {id, rate, defaultOwnerSharePercent} of rates || [] )
  {
    const update = {rate: rate || 0}
    if( null != defaultOwnerSharePercent )
      update.defaultOwnerSharePercent = defaultOwnerSharePercent

    await CostFactor.update( update, {where: {id}} )
  }

  return {success: true}
}
