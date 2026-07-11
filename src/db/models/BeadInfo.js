import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

const BeadInfo = sequelize.define(
  'BeadInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    category: { type: DataTypes.ENUM( 'glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other' ), defaultValue: 'plastic' },
    finish: { type: DataTypes.ENUM( 'fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain' ), defaultValue: 'plain' },
    shape: { type: DataTypes.ENUM( 'round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other' ), defaultValue: 'round' },
    color: { type: DataTypes.STRING, allowNull: false },
    length: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 6.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( BeadInfo, {as: 'beadInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
BeadInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default BeadInfo
