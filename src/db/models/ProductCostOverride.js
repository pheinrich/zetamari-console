import { DataTypes } from 'sequelize'
import Product from '@/db/models/Product'
import CostFactor from '@/db/models/CostFactor'
import sequelize from '@/db/sequelize'

// Product x CostFactor join, holding a manually-overridden quantity -
// deliberately sparse. A row only exists where someone has overridden a
// factor's computed default (mosaic surface area for tesserae/glass,
// border length for machineWear, area/distance-based heuristics for
// labor hours - all derived live from the product's own geometry/
// attributes in application code, never cached). No row for a given
// (product, factor) pair means "use the computed default." Reverting an
// override is just deleting its row.
const ProductCostOverride = sequelize.define(
  'ProductCostOverride',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    costFactorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: CostFactor, key: 'id' } },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  })

Product.hasMany( ProductCostOverride, { as: 'costOverrides', foreignKey: 'productId', onDelete: 'CASCADE' } )
CostFactor.hasMany( ProductCostOverride, { as: 'productOverrides', foreignKey: 'costFactorId' } )
ProductCostOverride.belongsTo( Product, { as: 'product', foreignKey: 'productId' } )
ProductCostOverride.belongsTo( CostFactor, { as: 'factor', foreignKey: 'costFactorId' } )

export default ProductCostOverride
