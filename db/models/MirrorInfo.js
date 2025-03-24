import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const MirrorInfo = sequelize.define(
  'BeadInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    shape: { type: DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis', 'other' ), defaultValue: 'circle' },
    width: { type: DataTypes.FLOAT, defaultValue: 6 },
    height: { type: DataTypes.FLOAT, defaultValue: 6 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.125 },
    bevel: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( MirrorInfo, {as: 'millefioriInfo', foreignKey: 'materialId'} )
MirrorInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId'} )

export default MirrorInfo
