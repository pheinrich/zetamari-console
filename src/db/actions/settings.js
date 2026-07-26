'use server'

import CostFactor from '@/db/models/CostFactor'
import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { bitCostPerHour, utilitiesCostPerHour } from '@/libs/machineRates'

// Settings is a singleton table - readSettings/updateSettings always
// operate on the first (and only) row, creating it on first write if it
// doesn't exist yet. Backs the company name/logo used on printed
// calculator reports (see calculator/report/ReportOptionsPanel.jsx), the
// shop process constants the cost-profile system's computed default
// quantities are derived from (see libs/costFactors.js) - feed rate and
// the sanding/glueing/grouting sq-in/hr throughput constants -
// markupPercent/retailMultiplier, which turn a product's COGS cost total
// into its Wholesale/Retail figures (see db/actions/productCost.js) - the
// four *WeightPerSqIn constants, which do the same for
// computeProductWeight()'s weight figure instead of $ - the bit-wear/
// electricity constants (bitLifeSheetsPerBit/cuttingTimeMinPerSheet/
// bitCostPerBit/powerDrawKw/electricityRatePerKwh), which feed the
// Machine Wear and Utilities CostFactors' rates - see updateSettings()
// below - and profilingKerfIn, which instead feeds costFactors.js's
// sheet-nesting geometry directly (see db/models/Settings.js).
const NUMERIC_FIELDS = [
  'feedRateInPerMin',
  'powerDrawKw',
  'electricityRatePerKwh',
  'sandingRateSqInPerHr',
  'glueingRateSqInPerHr',
  'groutingRateSqInPerHr',
  'markupPercent',
  'retailMultiplier',
  'tesseraeWeightPerSqIn',
  'mirrorGlassWeightPerSqIn',
  'groutWeightPerSqIn',
  'woodenBaseWeightPerSqIn',
  'bitLifeSheetsPerBit',
  'cuttingTimeMinPerSheet',
  'bitCostPerBit',
  'profilingKerfIn',
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
// configured" is a meaningful, distinct state from 0), markupPercent/
// retailMultiplier are `allowNull: false` (see Settings.js) - a blank
// field falls back to its own default rather than null, per-field since
// their defaults differ (25 vs 1).
const BLANK_FALLBACK = { markupPercent: 25, retailMultiplier: 1 }

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
      update[field] = blank ? (field in BLANK_FALLBACK ? BLANK_FALLBACK[field] : null) : Number( data[field] )
    }

  await settings.update( update )

  // Machine Wear's and Utilities' rates are no longer manually-entered
  // $/unit figures (see the Cost Factor Rates table in SettingsForm.jsx,
  // which now shows both rows as computed rather than editable) - they're
  // derived from the Machine constants just saved above, same way every
  // other computed quantity in this app is: recomputed fresh, not
  // cached, whenever its inputs change. Each is left untouched (whatever
  // it was before) if its own inputs aren't fully filled in yet - see
  // bitCostPerHour()/utilitiesCostPerHour(), which return 0 in that case,
  // and 0 isn't a meaningful "not yet configured" rate any more than it
  // would be for a manually-entered one, so this only overwrites once
  // there's an actual answer.
  const settingsJson = settings.toJSON()
  const machineWearRate = bitCostPerHour( settingsJson )
  const utilitiesRate = utilitiesCostPerHour( settingsJson )

  if( machineWearRate > 0 )
    await CostFactor.update( {rate: machineWearRate}, {where: {key: 'machineWear'}} )
  if( utilitiesRate > 0 )
    await CostFactor.update( {rate: utilitiesRate}, {where: {key: 'utilities'}} )

  return settingsJson
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
//
// Machine Wear/Utilities (see COMPUTED_RATE_KEYS) are excluded from the
// `rate` write here, even though a {id, rate} entry for them is still
// present in `rates` - SettingsForm.jsx renders their row as a hidden
// input (same "keep the array dense, same as a Labor stage row" trick as
// everywhere else in that table) carrying whatever `rate` this page most
// recently loaded with, which is exactly the *stale, pre-save* value the
// moment this same submit's updateSettings() call just finished deriving
// and persisting a fresh one from the Machine settings above - applying
// it here would silently stomp that fresh value right back to the old
// one on every single save. (Found the hard way: Machine Wear's rate
// stayed stuck at 0 no matter how many times Settings were saved, because
// this function was resetting it back to 0 immediately after
// updateSettings() correctly computed $6.30/hr.)
const COMPUTED_RATE_KEYS = new Set( ['machineWear', 'utilities'] )

export async function updateCostFactorRates( rates )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()

  const ids = (rates || []).map( r => r.id )
  const factors = ids.length ? await CostFactor.findAll( {where: {id: ids}} ) : []
  const keyById = Object.fromEntries( factors.map( f => [f.id, f.key] ) )

  for( const {id, rate, defaultOwnerSharePercent} of rates || [] )
  {
    if( COMPUTED_RATE_KEYS.has( keyById[id] ) )
      continue

    const update = {rate: rate || 0}
    if( null != defaultOwnerSharePercent )
      update.defaultOwnerSharePercent = defaultOwnerSharePercent

    await CostFactor.update( update, {where: {id}} )
  }

  return {success: true}
}
