import { DataTypes } from 'sequelize'
import Product from '@/db/models/Product'
import CostFactor from '@/db/models/CostFactor'
import sequelize from '@/db/sequelize'

// Product x CostFactor join, holding manual overrides of three
// independent things - deliberately sparse in all three.
// `quantityOverride` overrides the factor's computed default quantity
// (mosaic surface area for tesserae/glass, border length for
// machineWear, area/distance-based heuristics for labor hours, BOM-
// line-cost sum for the "bom" factor - all derived live in application
// code, never cached). `enabledOverride` overrides whether the factor
// counts toward the product's cost at all (default: true, except a
// factor superseded by a real BillOfMaterial line - e.g. Glass once a
// mirror component is in the BOM - which computes false by default;
// either can still be flipped back). `ownerShareOverride` (added by the
// 20260725000000-owner-assistant-labor.js migration) overrides a Labor
// stage factor's CostFactor.defaultOwnerSharePercent - see
// db/actions/productCost.js's computeLaborSplit(); meaningless for any
// other factor. A row exists whenever any of the three is non-null;
// reverting one just nulls that column, and the row itself is only
// deleted once all three are null again.
const ProductCostOverride = sequelize.define(
  'ProductCostOverride',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    costFactorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: CostFactor, key: 'id' } },
    quantityOverride: { type: DataTypes.FLOAT },
    enabledOverride: { type: DataTypes.BOOLEAN },
    ownerShareOverride: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

Product.hasMany( ProductCostOverride, { as: 'costOverrides', foreignKey: 'productId', onDelete: 'CASCADE' } )
CostFactor.hasMany( ProductCostOverride, { as: 'productOverrides', foreignKey: 'costFactorId' } )
ProductCostOverride.belongsTo( Product, { as: 'product', foreignKey: 'productId' } )
ProductCostOverride.belongsTo( CostFactor, { as: 'factor', foreignKey: 'costFactorId' } )

export default ProductCostOverride
