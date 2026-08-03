'use server'

import CostFactor from '@/db/models/CostFactor'
import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { bitCostPerHour, utilitiesCostPerHour } from '@/libs/machineRates'
import { woodenBaseRatePerSqIn } from '@/libs/woodenBaseRates'
import { markAllProductsCostStale } from '@/db/actions/productCost'

// Settings is a singleton table - readSettings/updateSettings always
// operate on the first (and only) row, creating it on first write if it
// doesn't exist yet. Backs the company name/logo used on printed
// calculator reports (see calculator/report/ReportOptionsPanel.jsx), the
// shop process constants the cost-profile system's computed default
// quantities are derived from (see libs/costFactors.js) - feed rate and
// the sanding/gluing/grouting sq-in/hr throughput constants -
// markupPercent/retailMultiplier, which turn a product's COGS cost total
// into its Wholesale/Retail figures (see db/actions/productCost.js) - the
// four *WeightPerSqIn constants, which do the same for
// computeProductWeight()'s weight figure instead of $ - the bit-wear/
// electricity constants (bitLifeSheetsPerBit/cuttingTimeMinPerSheet/
// bitCostPerBit/powerDrawKw/electricityRatePerKwh), which feed the
// Machine Wear and Utilities CostFactors' rates - see updateSettings()
// below - profilingKerfIn, which instead feeds costFactors.js's
// sheet-nesting geometry directly (see db/models/Settings.js) - and
// sheetCostPerSheet/sheetWidthIn/sheetHeightIn, which feed the Wooden
// Base CostFactor's rate (see libs/woodenBaseRates.js) and the Sheet
// Breakage CostFactor's formula.
const NUMERIC_FIELDS = [
  'feedRateInPerMin',
  'powerDrawKw',
  'electricityRatePerKwh',
  'sandingRateSqInPerHr',
  'gluingRateSqInPerHr',
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
  'sheetCostPerSheet',
  'sheetWidthIn',
  'sheetHeightIn',
  'glassSheetCostPerSheet',
  'glassSheetWidthIn',
  'glassSheetHeightIn',
  'pickingRateSqInPerHr',
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
// retailMultiplier, sheetWidthIn/sheetHeightIn, and pickingRateSqInPerHr
// are `allowNull: false` (see Settings.js) - a blank field falls back to
// its own default rather than null, per-field since their defaults
// differ.
const BLANK_FALLBACK = {
  markupPercent: 25,
  retailMultiplier: 1,
  sheetWidthIn: 48.5,
  sheetHeightIn: 96.5,
  pickingRateSqInPerHr: 300,
}

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

  // Machine Wear's, Utilities', and Wooden Base's rates are no longer
  // manually-entered $/unit figures (see the Cost Factor Rates table in
  // SettingsForm.jsx, which now shows all three rows as computed rather
  // than editable) - they're derived from the constants just saved
  // above, same way every other computed quantity in this app is:
  // recomputed fresh, not cached, whenever its inputs change. Each is
  // left untouched (whatever it was before) if its own inputs aren't
  // fully filled in yet - see bitCostPerHour()/utilitiesCostPerHour()/
  // woodenBaseRatePerSqIn(), which return 0 in that case, and 0 isn't a
  // meaningful "not yet configured" rate any more than it would be for a
  // manually-entered one, so this only overwrites once there's an actual
  // answer.
  const settingsJson = settings.toJSON()
  const machineWearRate = bitCostPerHour( settingsJson )
  const utilitiesRate = utilitiesCostPerHour( settingsJson )
  const woodenBaseRate = woodenBaseRatePerSqIn( settingsJson )

  if( machineWearRate > 0 )
    await CostFactor.update( {rate: machineWearRate}, {where: {key: 'machineWear'}} )
  if( utilitiesRate > 0 )
    await CostFactor.update( {rate: utilitiesRate}, {where: {key: 'utilities'}} )
  if( woodenBaseRate > 0 )
    await CostFactor.update( {rate: woodenBaseRate}, {where: {key: 'woodenBase'}} )

  // Every one of these process constants feeds computeDefaultQuantities()
  // (libs/costFactors.js) for every product in the catalog - there's no
  // cheap way to know in advance which products a given field actually
  // moves the needle for, so a Settings save marks every product's cached
  // COGS total stale (see productCost.js's "Cost cache invalidation"
  // section) rather than trying to guess. Cheap (a single bulk flag
  // flip) - the actual recompute only happens lazily, for whichever
  // products are next read.
  await markAllProductsCostStale()

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
// Machine Wear/Utilities/Wooden Base (see COMPUTED_RATE_KEYS) are
// excluded from the `rate` write here, even though a {id, rate} entry for
// them is still present in `rates` - SettingsForm.jsx renders their row
// as a hidden input (same "keep the array dense, same as a Labor stage
// row" trick as everywhere else in that table) carrying whatever `rate`
// this page most recently loaded with, which is exactly the *stale,
// pre-save* value the moment this same submit's updateSettings() call
// just finished deriving and persisting a fresh one from the Machine/
// Wooden Base Sheet settings above - applying it here would silently
// stomp that fresh value right back to the old one on every single save.
// (Found the hard way: Machine Wear's rate stayed stuck at 0 no matter
// how many times Settings were saved, because this function was
// resetting it back to 0 immediately after updateSettings() correctly
// computed $6.30/hr.)
const COMPUTED_RATE_KEYS = new Set( ['machineWear', 'utilities', 'woodenBase'] )

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

  // A rate change affects every product costed against that factor -
  // effectively the whole catalog for the common Material/Machine
  // factors - so mark everything stale, same as updateSettings() above
  // (which already calls this too, on the same Settings-page submit -
  // redundant in that common case, but this function is also callable on
  // its own, and a rate-only change without any Settings field changing
  // still needs to invalidate the cache).
  await markAllProductsCostStale()

  return {success: true}
}
