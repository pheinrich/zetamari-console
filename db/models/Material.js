import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

const Material = sequelize.define(
  'Material',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    type: { type: DataTypes.ENUM( 'bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile' ), allowNull: false },
    sku: { type: DataTypes.STRING, unique: true, allowNull: false },
    units: { type: DataTypes.STRING, defaultValue: 'each' },
    weight: { type: DataTypes.FLOAT },
    description: { type: DataTypes.TEXT }
  },
  {
    timestamps: false,
  })

export default Material
