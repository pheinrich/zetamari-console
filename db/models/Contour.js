import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'

const Contour = sequelize.define(
  'Contour',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    svgData: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

export default Contour
