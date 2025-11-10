import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Order from '@/db/models/Order'

const OrderProduct = sequelize.define(
  'OrderProduct',
  {
    orderId: { type: DataTypes.INTEGER, references: { model: Order, key: id } },
    productId: { type: DataTypes.INTEGER, references: { model: Product, key: id } },
    quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
  },
  {
    timestamps: false,
  })

Order.belongsToMany( Product, { through: OrderProduct } )
Product.belongsToMany( Order, { through: OrderProduct } )

export default OrderProduct
