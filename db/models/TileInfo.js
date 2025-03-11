import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const TileInfo = sequelize.define(
  'TileInfo',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    color: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 20.0 },
    depth: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  },
  {
    timestamps: false,
  })

Material.belongsTo( TileInfo )
TileInfo.hasOne( Material )

export default TileInfo
