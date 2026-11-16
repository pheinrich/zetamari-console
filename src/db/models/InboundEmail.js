import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import ChannelOrder from '@/db/models/ChannelOrder'

// An email received at /api/inbound/order-email, stored byte-for-byte
// in `raw` regardless of whether it was an order, so parsing can be
// re-run after a parser fix - see CONTEXT.md's Inbound Email entry.
// `kind` comes from src/libs/channelOrders's classifyOrderEmail();
// `status` is where processing got to, with `error` saying why when it
// 'failed'.
const InboundEmail = sequelize.define(
  'InboundEmail',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    messageId: { type: DataTypes.STRING( 512 ), allowNull: false, unique: true },
    fromAddress: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING( 1024 ) },
    sentAt: { type: DataTypes.DATE },
    receivedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    raw: { type: DataTypes.BLOB( 'medium' ), allowNull: false },
    channel: { type: DataTypes.STRING( 32 ) },
    kind: { type: DataTypes.ENUM( 'new-order', 'other', 'unrecognized' ) },
    status: { type: DataTypes.ENUM( 'received', 'parsed', 'ignored', 'failed' ), allowNull: false, defaultValue: 'received' },
    error: { type: DataTypes.TEXT },
    channelOrderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: ChannelOrder, key: 'id' } },
  },
  {
    timestamps: false,
  })

ChannelOrder.hasMany( InboundEmail, {foreignKey: 'channelOrderId'} )
InboundEmail.belongsTo( ChannelOrder, {foreignKey: 'channelOrderId'} )

export default InboundEmail
