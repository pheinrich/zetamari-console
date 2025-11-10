import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Material from '@/db/models/Material'

const MillefioriInfo = sequelize.define(
  'MillefioriInfo',
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

Material.hasOne( MillefioriInfo, {as: 'millefioriInfo', foreignKey: 'materialId', onDelete: 'CASCADE'} )
MillefioriInfo.belongsTo( Material, {as: 'material', allowNull: false, foreignKey: 'materialId', onDelete: 'CASCADE'} )

export default MillefioriInfo
