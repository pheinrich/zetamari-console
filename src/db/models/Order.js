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

    // Declared explicitly (rather than left to belongsTo() below to
    // create implicitly) so it matches the 20260807050000-orders-
    // customer.js migration's column exactly and so query results built
    // from a raw `attributes`/`group` aggregate (e.g. readCustomers()'s
    // orderCount) expose it as a normal instance property - see that
    // migration's fix commit for the full story. Same pattern
    // SupplierProduct.js already uses for supplierId/productId.
    customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Customer, key: 'id' } },
  },
  {
    timestamps: false,
  })

User.hasMany( Order )
Order.belongsTo( User )

// Nullable - see the 20260807050000-orders-customer.js migration. Lets
// the Customer detail page (Visualizer/products' sibling under the new
// customer/contact/student master list) show a customer's order history.
Customer.hasMany( Order, {foreignKey: 'customerId'} )
Order.belongsTo( Customer, {foreignKey: 'customerId'} )

export default Order
