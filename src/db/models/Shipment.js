import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Order from '@/db/models/Order'

const Shipment = sequelize.define(
  'Shipment',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    carrier: { type: DataTypes.STRING, allowNull: false },
    tracking: { type: DataTypes.STRING, allowNull: false },
    createdOn: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

Order.hasMany( Shipment )
Shipment.belongsTo( Order, {allowNull: false} )

export default Shipment
