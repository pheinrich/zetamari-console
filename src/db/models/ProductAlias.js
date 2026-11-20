import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// A channel SKU known to mean a console Product - a misspelled or outdated
// version of its SKU (IndieMe's ZMCi7-Joy for ZMCi07-Joy). Keyed on the
// SKU alone, since every channel sends Zetamari's own SKUs; `channel`
// just records where it was first seen. Learned when a person matches a
// Channel Order Line by hand - see src/libs/channelOrders/matching.js.
const ProductAlias = sequelize.define(
  'ProductAlias',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    channel: { type: DataTypes.STRING( 32 ) },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

Product.hasMany( ProductAlias, {foreignKey: 'productId', as: 'aliases', onDelete: 'CASCADE'} )
ProductAlias.belongsTo( Product, {foreignKey: 'productId'} )

export default ProductAlias
