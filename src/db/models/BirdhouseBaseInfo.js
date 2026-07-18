import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// BirdhouseBase's first-ever Info table - 'birdhouse'/'birdhouse base'
// previously had no type-specific dimensions at all. A box, not a traced
// outline, so - like PictureFrameInfo - there's no shape/Contour
// reference here, just width/height/depth.
const BirdhouseBaseInfo = sequelize.define(
  'BirdhouseBaseInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, allowNull: true },
    height: { type: DataTypes.FLOAT, allowNull: true },
    depth: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( BirdhouseBaseInfo, {as: 'birdhouseBaseInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
BirdhouseBaseInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default BirdhouseBaseInfo
