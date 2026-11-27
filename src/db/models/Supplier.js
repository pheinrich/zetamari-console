import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Address from '@/db/models/Address'

const Supplier = sequelize.define(
  'Supplier',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING },
    addressId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Address, key: 'id' } },   // see Address.js
    phone: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

Supplier.belongsTo( Address, {foreignKey: 'addressId'} )

export default Supplier
