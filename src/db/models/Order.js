import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'
import Customer from '@/db/models/Customer'

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdOn: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    completedOn: { type: DataTypes.DATEONLY },
    packedOn: { type: DataTypes.DATEONLY },
  },
  {
    timestamps: false,
  })

User.hasMany( Order )
Order.belongsTo( User )

// Nullable - see the 20260807050000-orders-customer.js migration. Lets
// the Customer detail page (Visualizer/products' sibling under the new
// customer/contact/student master list) show a customer's order history.
Customer.hasMany( Order )
Order.belongsTo( Customer )

export default Order
