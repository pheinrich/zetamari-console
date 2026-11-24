import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import Person from '@/db/models/Person'
import Order from '@/db/models/Order'

// An order as a sales channel (IndieMe, Faire, Houzz, ...) reported it,
// staged for review before it becomes an Order - see CONTEXT.md's
// Channel Order entry and the 20261116000000-channel-order-intake.js
// migration for why this is separate from Order.
//
// `linesComplete` is false when the source didn't carry every line
// (Faire's new-order email shows at most four), with
// `expectedLineCount` saying how many there should be. `total` is what
// the channel labelled Total - for Faire that's the payout after
// `commission`, so `subtotal` is the wholesale order value.
const ChannelOrder = sequelize.define(
  'ChannelOrder',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    channel: { type: DataTypes.STRING( 32 ), allowNull: false },
    externalOrderId: { type: DataTypes.STRING( 64 ), allowNull: false },
    status: { type: DataTypes.ENUM( 'new', 'accepted', 'dismissed' ), allowNull: false, defaultValue: 'new' },
    orderedOn: { type: DataTypes.DATEONLY },
    requestedShipDate: { type: DataTypes.STRING },
    shippingMethod: { type: DataTypes.STRING },   // the delivery mechanism the channel named, if any
    paymentType: { type: DataTypes.STRING },

    buyerCompany: { type: DataTypes.STRING },
    buyerName: { type: DataTypes.STRING },
    buyerEmail: { type: DataTypes.STRING },
    buyerPhone: { type: DataTypes.STRING },
    buyerExternalId: { type: DataTypes.STRING },
    shipTo: { type: DataTypes.JSON },

    linesComplete: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    expectedLineCount: { type: DataTypes.INTEGER },
    subtotal: { type: DataTypes.DECIMAL( 10, 2 ) },
    shipping: { type: DataTypes.DECIMAL( 10, 2 ) },
    discount: { type: DataTypes.DECIMAL( 10, 2 ) },
    tax: { type: DataTypes.DECIMAL( 10, 2 ) },
    commission: { type: DataTypes.DECIMAL( 10, 2 ) },
    commissionLabel: { type: DataTypes.STRING },
    total: { type: DataTypes.DECIMAL( 10, 2 ) },
    notes: { type: DataTypes.TEXT },

    customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Person, key: 'id' } },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, fields: ['channel', 'externalOrderId'] }],
  })

Person.hasMany( ChannelOrder, {foreignKey: 'customerId', as: 'ChannelOrdersAsCustomer'} )
ChannelOrder.belongsTo( Person, {foreignKey: 'customerId', as: 'Customer'} )

// Linked to Orders many-to-many, since Orders can be split and combined
// (see the 20261123000000-channel-order-links-and-shipping-method.js
// migration). 'accepted' means it has at least one Order.
export const ChannelOrderOrder = sequelize.define(
  'ChannelOrderOrder',
  {
    channelOrderId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: 'ChannelOrders', key: 'id' } },
    orderId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: Order, key: 'id' } },
  },
  {
    timestamps: false,
  })

ChannelOrder.belongsToMany( Order, {through: ChannelOrderOrder, foreignKey: 'channelOrderId', otherKey: 'orderId'} )
Order.belongsToMany( ChannelOrder, {through: ChannelOrderOrder, foreignKey: 'orderId', otherKey: 'channelOrderId'} )

export default ChannelOrder
