import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    sku: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
    priceWholesale: { type: DataTypes.DECIMAL( 5, 2 ) },
    priceRetail: { type: DataTypes.DECIMAL( 5, 2 ) },
  },
  {
    timestamps: false,
  })

export default Product
