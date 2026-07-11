import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

const TileInfo = sequelize.define(
  'TileInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    color: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( TileInfo, {as: 'tileInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
TileInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default TileInfo
