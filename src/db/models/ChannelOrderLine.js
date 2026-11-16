import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import ChannelOrder from '@/db/models/ChannelOrder'
import Product from '@/db/models/Product'

// One line of a Channel Order, exactly as the channel reported it - the
// channel's own `sku`, `description` and `unitPrice` are kept even once
// matched, so a SKU that drifted between IndieMe/Faire/QuickBooks and
// the console stays visible rather than being silently replaced.
// `productId` is the console Product it was matched to, if any.
const ChannelOrderLine = sequelize.define(
  'ChannelOrderLine',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    channelOrderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: ChannelOrder, key: 'id' } },
    position: { type: DataTypes.INTEGER, allowNull: false },
    sku: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING( 1024 ) },
    unitPrice: { type: DataTypes.DECIMAL( 10, 2 ) },
    quantity: { type: DataTypes.FLOAT },
    productId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Product, key: 'id' } },
  },
  {
    timestamps: false,
  })

ChannelOrder.hasMany( ChannelOrderLine, {foreignKey: 'channelOrderId', as: 'Lines', onDelete: 'CASCADE'} )
ChannelOrderLine.belongsTo( ChannelOrder, {foreignKey: 'channelOrderId'} )

Product.hasMany( ChannelOrderLine, {foreignKey: 'productId'} )
ChannelOrderLine.belongsTo( Product, {foreignKey: 'productId'} )

export default ChannelOrderLine
