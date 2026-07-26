import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Contour from '@/db/models/Contour'

// The "complex shape" case: defined by an outside contour (required) plus
// optional inside and rabbet contours. Renamed from SubstrateInfo/
// 'substrate' - see the 20260723000000-rename-product-types.js and
// 20260723010000-rename-info-tables.js migrations.
//
// piecesPerSheet (added by 20260731000000-sheet-breakage-cost-factor.js)
// is how many copies of THIS shape actually fit on one standard sheet of
// plywood - null (the default) means "not yet known", in which case the
// Sheet Breakage CostFactor (see libs/costFactors.js) falls back to a
// live grid-packing estimate from the shape's kerf-padded bounding-
// rectangle dimensions; a shop can instead enter a real count, learned
// from actually nesting/cutting the shape, when editing the product
// (ProductForm.jsx) - that always wins over the estimate. Any non-
// positive value is also treated as "not yet known" (see
// libs/costFactors.js), so 0 is a safe placeholder too, not just null.
const WoodenBaseInfo = sequelize.define(
  'WoodenBaseInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.455 },
    border: { type: DataTypes.FLOAT, defaultValue: 1.0 },
    piecesPerSheet: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( WoodenBaseInfo, {as: 'woodenBaseInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
WoodenBaseInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

WoodenBaseInfo.belongsTo( Contour, {as: 'outside', allowNull: false} )
WoodenBaseInfo.belongsTo( Contour, {as: 'inside', allowNull: true, defaultValue: null} )
WoodenBaseInfo.belongsTo( Contour, {as: 'rabbet', allowNull: true, defaultValue: null} )

export default WoodenBaseInfo
