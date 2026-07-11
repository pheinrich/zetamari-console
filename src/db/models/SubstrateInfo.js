import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Contour from '@/db/models/Contour'

// The "complex shape" case: defined by an outside contour (required) plus
// optional inside and rabbet contours.
const SubstrateInfo = sequelize.define(
  'SubstrateInfo',
  {
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.455 },
    border: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so productId substitute required above
    timestamps: false,
  })

Product.hasOne( SubstrateInfo, {as: 'substrateInfo', foreignKey: 'productId', onDelete: 'CASCADE'} )
SubstrateInfo.belongsTo( Product, {as: 'product', allowNull: false, foreignKey: 'productId', onDelete: 'CASCADE'} )

SubstrateInfo.belongsTo( Contour, {as: 'outside', allowNull: false} )
SubstrateInfo.belongsTo( Contour, {as: 'inside', allowNull: true, defaultValue: null} )
SubstrateInfo.belongsTo( Contour, {as: 'rabbet', allowNull: true, defaultValue: null} )

export default SubstrateInfo
