import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

const MillefioriInfo = sequelize.define(
  'MillefioriInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    shape: { type: DataTypes.ENUM( 'round', 'square' ), defaultValue: 'round' },
    color: { type: DataTypes.STRING, allowNull: false },
    length: { type: DataTypes.FLOAT, defaultValue: 5.0 },
    width: { type: DataTypes.FLOAT, defaultValue: 5.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( MillefioriInfo, {as: 'millefioriInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
MillefioriInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

export default MillefioriInfo
