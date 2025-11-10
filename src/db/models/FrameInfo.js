import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const FrameInfo = sequelize.define(
  'FrameInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    width: { type: DataTypes.FLOAT, defaultValue: 7.75 },
    height: { type: DataTypes.FLOAT, defaultValue: 9.75 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 0.625 },
    channel: { type: DataTypes.FLOAT, defaultValue: 1.75 },
    border: { type: DataTypes.FLOAT, defaultValue: 0.25 },
    photoWidth: { type: DataTypes.FLOAT, defaultValue: 4 },
    photoHeight: { type: DataTypes.FLOAT, defaultValue: 6 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( FrameInfo, {as: 'frameInfo', foreignKey: 'materialId', onDelete: 'CASCADE'} )
FrameInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId', onDelete: 'CASCADE'} )

export default FrameInfo
