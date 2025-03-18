import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const BeadInfo = sequelize.define(
  'BeadInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    type: { type: DataTypes.ENUM( 'ceramic', 'glass', 'plastic', 'metal' ), defaultValue: 'plastic' },
    finish: { type: DataTypes.ENUM( 'fire-polished', 'iridized', 'metalized', 'plain' ), defaultValue: 'plain' },
    color: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    depth: { type: DataTypes.FLOAT, defaultValue: 6.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( BeadInfo, {foreignKey: 'materialId'} )
BeadInfo.belongsTo( Material, {allowNull: false, foreignKey: 'materialId'} )

export default BeadInfo
