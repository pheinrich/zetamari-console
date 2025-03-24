import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const BeadInfo = sequelize.define(
  'BeadInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    category: { type: DataTypes.ENUM( 'glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other' ), defaultValue: 'plastic' },
    finish: { type: DataTypes.ENUM( 'fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain' ), defaultValue: 'plain' },
    shape: { type: DataTypes.ENUM( 'round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other' ), defaultValue: 'round' },
    color: { type: DataTypes.STRING, allowNull: false },
    length: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 6.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( BeadInfo, {as: 'beadInfo', foreignKey: 'materialId', onDelete: 'CASCADE'} )
BeadInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId', onDelete: 'CASCADE'} )

export default BeadInfo
