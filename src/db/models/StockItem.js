import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// How much of a Product is on hand - see CONTEXT.md's Stock entry. Only
// tracked Products have a row (one each); the quantity is set by hand
// for now, in the Product's own units, so it may be fractional (pounds
// of grout) for supplies. Deleting the Product deletes its row.
const StockItem = sequelize.define(
  'StockItem',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: Product, key: 'id' } },
    quantity: { type: DataTypes.DECIMAL( 12, 3 ), allowNull: false, defaultValue: 0 },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

Product.hasOne( StockItem, {foreignKey: 'productId', onDelete: 'CASCADE'} )
StockItem.belongsTo( Product, {foreignKey: 'productId'} )

export default StockItem
