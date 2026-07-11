import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// Frames are always rectangular, so there's intentionally no shape or
// contour reference here - just physical dimensions.
const FrameInfo = sequelize.define(
  'FrameInfo',
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

Product.hasOne( FrameInfo, {as: 'frameInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
FrameInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default FrameInfo
