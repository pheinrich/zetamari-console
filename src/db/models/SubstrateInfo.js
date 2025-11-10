import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'
import Contour from '@/db/models/Contour'

const SubstrateInfo = sequelize.define(
  'SubstrateInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.455 },
    border: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( SubstrateInfo, {as: 'substrateInfo', foreignKey: 'materialId', onDelete: 'CASCADE'} )
SubstrateInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId', onDelete: 'CASCADE'} )

SubstrateInfo.belongsTo( Contour, {as: 'outside', allowNull: false} )
SubstrateInfo.belongsTo( Contour, {as: 'inside', allowNull: true, defaultValue: null} )
SubstrateInfo.belongsTo( Contour, {as: 'rabbet', allowNull: true, defaultValue: null} )

export default SubstrateInfo
