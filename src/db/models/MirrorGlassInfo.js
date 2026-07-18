import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// Renamed from MirrorInfo/'mirror' - see the
// 20260723000000-rename-product-types.js and
// 20260723010000-rename-info-tables.js migrations.
//
// `shape` is still the old parametric-only ENUM (not yet a Contour
// reference like WoodenBaseInfo's outside/inside/rabbet) - deliberately
// untouched here pending a decision on whether/how a MirrorGlass
// product's shape should move to a single Contour reference instead.
const MirrorGlassInfo = sequelize.define(
  'MirrorGlassInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    shape: { type: DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis', 'other' ), defaultValue: 'circle' },
    width: { type: DataTypes.FLOAT, defaultValue: 6 },
    height: { type: DataTypes.FLOAT, defaultValue: 6 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.125 },
    bevel: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( MirrorGlassInfo, {as: 'mirrorGlassInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
MirrorGlassInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default MirrorGlassInfo
