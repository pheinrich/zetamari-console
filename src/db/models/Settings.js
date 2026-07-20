import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A single-row table holding organization-wide preferences - company
// name/logo used to brand printed calculator reports, plus the physical/
// process constants the cost-profile system's computed default
// quantities are derived from (see the 20260716000000-cost-profiles.js
// migration): feed rate and power draw convert a product's cut distance
// into machine run-time (feeding both the utilities and CNC-labor cost
// factors), and the sq-in/hr throughput constants seed the sanding/
// glueing/grouting labor-hour heuristics. These are shop facts, not
// pricing policy, which is why they live here rather than on CostFactor.
// Always read/written as the first (and only) row - see
// src/db/actions/settings.js - rather than a true key-value store, since
// there's only ever one of these.
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
const Settings = sequelize.define(
  'Settings',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
    feedRateInPerMin: { type: DataTypes.FLOAT },
    powerDrawKwh: { type: DataTypes.FLOAT },
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
  },
  {
    timestamps: false,
  })

export default Settings
