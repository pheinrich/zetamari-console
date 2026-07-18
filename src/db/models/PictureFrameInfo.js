import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// Frames are always rectangular, so there's intentionally no shape or
// contour reference here - just physical dimensions. Renamed from
// FrameInfo/'frame' - see the 20260723000000-rename-product-types.js and
// 20260723010000-rename-info-tables.js migrations.
const PictureFrameInfo = sequelize.define(
  'PictureFrameInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, defaultValue: 7.75 },
    height: { type: DataTypes.FLOAT, defaultValue: 9.75 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.625 },
    channel: { type: DataTypes.FLOAT, defaultValue: 1.75 },
    border: { type: DataTypes.FLOAT, defaultValue: 0.25 },
    photoWidth: { type: DataTypes.FLOAT, defaultValue: 4 },
    photoHeight: { type: DataTypes.FLOAT, defaultValue: 6 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( PictureFrameInfo, {as: 'pictureFrameInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
PictureFrameInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default PictureFrameInfo
