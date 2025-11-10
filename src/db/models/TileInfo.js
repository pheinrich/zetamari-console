import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const TileInfo = sequelize.define(
  'TileInfo',
  {
    materialId: { type: DataTypes.INTEGER, primaryKey: true },
    color: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    thickness: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  },
  {
    noPrimaryKey: true,    // currently ignored, so materialId substitute required above
    timestamps: false,
  })

Material.hasOne( TileInfo, {as: 'tileInfo', foreignKey: 'materialId', onDelete: 'CASCADE'} )
TileInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId', onDelete: 'CASCADE'} )

export default TileInfo
