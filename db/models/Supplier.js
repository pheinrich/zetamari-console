import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

const Supplier = sequelize.define(
  'Supplier',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

export default Supplier
