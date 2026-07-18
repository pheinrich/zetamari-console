import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Contour from '@/db/models/Contour'

// Renamed from MirrorInfo/'mirror' - see the
// 20260723000000-rename-product-types.js and
// 20260723010000-rename-info-tables.js migrations.
//
// `shape` is still the old parametric-only ENUM (not a Contour
// reference like WoodenBaseInfo's outside/inside/rabbet). `contourId`
// (see the 20260724000000-mirror-glass-contour.js migration) is the
// first step of item 8's single-Contour redesign - deliberately
// additive/nullable rather than a replacement, so existing rows keep
// working unchanged while a product can optionally point at a real
// Contour instead. Nothing derives geometry/cost from `contour` yet;
// that's a follow-up once enough products have adopted it.
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

MirrorGlassInfo.belongsTo( Contour, {as: 'contour', allowNull: true, defaultValue: null} )

export default MirrorGlassInfo
