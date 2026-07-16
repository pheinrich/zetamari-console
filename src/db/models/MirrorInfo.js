import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

const MirrorInfo = sequelize.define(
  'MirrorInfo',
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

Product.hasOne( MirrorInfo, {as: 'mirrorInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
MirrorInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default MirrorInfo
