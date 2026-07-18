import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'

// Lookup table of the calculator's configurable pricing inputs - material-
// by-area (tesserae/glass/substrate), machine time (wear/utilities), and
// the labor stages (design/CNC/sanding/glueing/grouting/finishing). See
// the 20260716000000-cost-profiles.js migration for the full rationale;
// in short, this is pricing policy (what to charge per unit of production
// effort), kept separate from BillOfMaterial/SupplierProduct's COGS
// (what discrete purchased materials actually cost).
//
// `unit` is the physical unit a product's *quantity* for this factor is
// tracked in ('sqin', 'in' for cut distance, 'min'/'hr'). `rateUnit` is
// the unit `rate` is quoted in - null means "same as unit" (true for
// every factor except the six Labor ones, which track quantity in
// minutes but are rated per hour - see the 20260719000000-labor-rate-
// unit-hours.js migration for why). Cost calculations convert a quantity
// from `unit` to `rateUnit` before multiplying by rate - see
// db/actions/productCost.js. `category` ('material'/'machine'/'labor')
// is just for grouping in the UI.
//
// `rate` is the one $/unit COGS rate for this factor, shop-wide - see the
// 20260722000000-simplify-cost-profiles.js migration, which folded the
// old per-profile RateProfile/ProfileRate system down to this single
// column (editable from the Settings page, alongside the process
// constants) plus Settings.wholesaleMultiplier/retailMultiplier for
// deriving Wholesale/Retail cost-breakdown figures from it.
//
// The six Labor-category stage factors (Design/CNC/Sanding/Glueing/
// Grouting/Finishing) are a special case as of the
// 20260725000000-owner-assistant-labor.js migration: their `rate` is no
// longer used. Instead, `defaultOwnerSharePercent` (0-100, meaningful
// only for these six) is the shop-wide default share of a stage's time
// billed at the 'laborOwner' rate rather than 'laborAssistant' - see
// db/actions/productCost.js's computeLaborSplit(). `laborOwner`/
// `laborAssistant` are themselves two more CostFactor rows (so their
// $/hr rate reuses this same Settings table), but they don't carry a
// `defaultOwnerSharePercent` and never appear as their own row in a
// product's cost breakdown - they're looked up by key purely for `rate`.
const CostFactor = sequelize.define(
  'CostFactor',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING, unique: true, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    rateUnit: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    rate: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    defaultOwnerSharePercent: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

export default CostFactor
