import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'
import Contour from '@/db/models/Contour'

const SubstrateInfo = sequelize.define(
  'SubstrateInfo',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    width: { type: DataTypes.FLOAT, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    depth: { type: DataTypes.FLOAT, defaultValue: 0.455 },
    border: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  },
  {
    timestamps: false,
  })

Material.belongsTo( SubstrateInfo )
SubstrateInfo.hasOne( Material )

SubstrateInfo.belongsTo( Contour, {as: 'outside', allowNull: false} )
SubstrateInfo.belongsTo( Contour, {as: 'inside'} )
SubstrateInfo.belongsTo( Contour, {as: 'rabbet'} )

export default SubstrateInfo
