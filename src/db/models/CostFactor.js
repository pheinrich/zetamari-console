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
// `unit` is the physical unit a product's quantity for this factor is
// tracked in ('sqin', 'in' for cut distance, 'hr') - ProfileRate.rate is
// always $ per that unit. `category` ('material'/'machine'/'labor') is
// just for grouping in the UI.
const CostFactor = sequelize.define(
  'CostFactor',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING, unique: true, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  })

export default CostFactor
