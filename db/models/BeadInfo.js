import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const BeadInfo = sequelize.define(
  'BeadInfo',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM( 'ceramic', 'plastic', 'metal' ), defaultValue: 'plastic' },
    finish: { type: DataTypes.ENUM( 'fire-polished', 'iridized', 'metalized', 'plain' ), defaultValue: 'plain' },
    color: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 6.0 },
    depth: { type: DataTypes.FLOAT, defaultValue: 6.0 },
  },
  {
    timestamps: false,
  })

Material.belongsTo( BeadInfo )
BeadInfo.hasOne( Material )

export default BeadInfo
