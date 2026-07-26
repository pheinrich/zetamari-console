import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A single-row table holding organization-wide preferences - company
// name/logo used to brand printed calculator reports, plus the physical/
// process constants the cost-profile system's computed default
// quantities (and, as of item 14 below, some CostFactor rates) are
// derived from (see the 20260716000000-cost-profiles.js migration): feed
// rate converts a product's cut distance into machine run-time (feeding
// the Machine Wear/Utilities/CNC-labor cost factors), and the sq-in/hr
// throughput constants seed the sanding/glueing/grouting labor-hour
// heuristics. These are shop facts, not pricing policy, which is why they
// live here rather than on CostFactor. Always read/written as the first
// (and only) row - see src/db/actions/settings.js - rather than a true
// key-value store, since there's only ever one of these.
//
// powerDrawKw/electricityRatePerKwh: power draw is a rate (kW - how fast
// the machine consumes energy while running), not an energy quantity, so
// it's kW, not kWh - the "h" in the field's original name
// (powerDrawKwh, renamed by 20260729000000-power-draw-kw.js) was a
// mislabel, not a different unit needing conversion. Together with
// electricityRatePerKwh ($/kWh), powerDrawKw x electricityRatePerKwh
// gives $/hr - see the Utilities discussion below.
//
// retailMultiplier: added by the 20260722000000-simplify-cost-profiles.js
// migration, replacing the old RateProfile/ProfileRate system's separate
// per-factor rates for each pricing tier. Still a straight multiplier -
// Wholesale x retailMultiplier = Retail - unchanged since.
//
// markupPercent (renamed from wholesaleMultiplier by the
// 20260726000000-cogs-formula-v2.js migration, alongside item 13's
// 20260725000000-owner-assistant-labor.js) is different in kind, not
// just name: a percentage applied to the *entire* COGS figure rather
// than a x1-style multiplier applied to part of it. See
// db/actions/productCost.js for the exact formula: COGS = materials +
// machine + assistant labor cost (no markup at all); Wholesale = COGS x
// (1 + markupPercent/100) + owner labor cost; Retail = Wholesale x
// retailMultiplier.
//
// *WeightPerSqIn (added by 20260723030000-settings-weight-per-sqin.js)
// are the shop-wide weight densities for the four area-based Material
// CostFactors (tesserae/mirrorGlass/grout/woodenBase) - productCost.js's
// computeProductWeight() multiplies each factor's already-computed area
// by its matching constant here to get that factor's weight
// contribution, the same way CostFactor.rate turns that area into a $
// contribution.
//
// bitLifeSheetsPerBit/cuttingTimeMinPerSheet/bitCostPerBit (added by
// 20260728000000-bit-wear-cost-factor.js) are the shop's average bit-wear
// figures - see libs/machineRates.js for the derived working-life/cost
// math. Unlike the other process constants above, these don't feed a
// computed *quantity* in costFactors.js - along with powerDrawKw/
// electricityRatePerKwh, they feed the Machine Wear and Utilities
// CostFactors' $/hr *rates* instead (see db/actions/settings.js's
// updateSettings()) - Machine Wear's rate is a bit's cost spread over its
// working life, Utilities' rate is what the machine's electricity costs
// per hour of runtime; neither is tied to any one product's geometry the
// way a *quantity* (how many hours *this* product takes to cut) is.
//
// profilingKerfIn (added by 20260730000000-profiling-kerf.js) is the
// CNC profiling bit's actual width (e.g. 0.25" for a 1/4" bit) - unlike
// every field above, this doesn't feed a CostFactor rate at all, it
// feeds costFactors.js's *geometry*: a piece's true footprint on a sheet
// of plywood is its outside OBB (see libs/mirror.js's getMinBoundRect())
// grown by 2x this value in each direction, since two adjacent pieces
// can't share a single cut line - each one needs a full bit-width of
// clearance on every side it borders another piece or the sheet edge.
// Deliberately not baked into build()/getMinBoundRect() itself (a pure
// geometry function with no Settings access, also run client-side by the
// live calculator) - costFactors.js applies the padding itself using the
// raw width/height getMinBoundRect() exposes.
const Settings = sequelize.define(
  'Settings',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
    feedRateInPerMin: { type: DataTypes.FLOAT },
    powerDrawKw: { type: DataTypes.FLOAT },
    electricityRatePerKwh: { type: DataTypes.FLOAT },
    sandingRateSqInPerHr: { type: DataTypes.FLOAT },
    glueingRateSqInPerHr: { type: DataTypes.FLOAT },
    groutingRateSqInPerHr: { type: DataTypes.FLOAT },
    markupPercent: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 25 },
    retailMultiplier: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 1 },
    tesseraeWeightPerSqIn: { type: DataTypes.FLOAT },
    mirrorGlassWeightPerSqIn: { type: DataTypes.FLOAT },
    groutWeightPerSqIn: { type: DataTypes.FLOAT },
    woodenBaseWeightPerSqIn: { type: DataTypes.FLOAT },
    bitLifeSheetsPerBit: { type: DataTypes.FLOAT },
    cuttingTimeMinPerSheet: { type: DataTypes.FLOAT },
    bitCostPerBit: { type: DataTypes.FLOAT },
    profilingKerfIn: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

export default Settings
