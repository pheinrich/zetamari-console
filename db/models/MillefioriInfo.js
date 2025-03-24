import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const MillefioriInfo = sequelize.define(
  'BeadInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    shape: { type: DataTypes.ENUM( 'round', 'square' ), defaultValue: 'round' },
    color: { type: DataTypes.STRING, allowNull: false },
    length: { type: DataTypes.FLOAT, defaultValue: 5.0 },
    width: { type: DataTypes.FLOAT, defaultValue: 5.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( MillefioriInfo, {as: 'mirrorInfo', foreignKey: 'materialId'} )
MillefioriInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId'} )

export default MillefioriInfo
