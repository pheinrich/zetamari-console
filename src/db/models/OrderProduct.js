import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Order from '@/db/models/Order'

const OrderProduct = sequelize.define(
  'OrderProduct',
  {
    orderId: { type: DataTypes.INTEGER, references: { model: Order, key: 'id' } },
    productId: { type: DataTypes.INTEGER, references: { model: Product, key: 'id' } },
    quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
  },
  {
    timestamps: false,
  })

// foreignKey/otherKey pinned to the columns actually declared above -
// without them, belongsToMany invents its own PascalCase attributes
// (OrderId/ProductId) alongside the real orderId/productId columns.
// Those never existed as real DB columns (nothing ever wrote through
// this association until db/actions/order.js), but Sequelize still
// includes both spellings on OrderProduct.create()/.save(), and MySQL
// treats column names case-insensitively - producing "Column 'orderId'
// specified twice" the moment anything actually creates a row.
Order.belongsToMany( Product, { through: OrderProduct, foreignKey: 'orderId', otherKey: 'productId' } )
Product.belongsToMany( Order, { through: OrderProduct, foreignKey: 'productId', otherKey: 'orderId' } )

export default OrderProduct
