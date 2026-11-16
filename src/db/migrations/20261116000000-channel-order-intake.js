'use strict'

/*
 * Order intake from sales-channel notification emails (IndieMe, Faire,
 * Houzz, ...) - see CONTEXT.md's Inbound Email / Channel Order entries.
 *
 * InboundEmails keeps every email POSTed to /api/inbound/order-email
 * byte-for-byte (`raw`), whether or not it turned out to be an order, so
 * a parser fix can be replayed over past mail instead of waiting for new
 * orders. `messageId` (the RFC 5322 Message-ID, or a hash of the raw
 * bytes when missing) makes redelivery idempotent. The link runs email
 * -> order (`channelOrderId`), since one Channel Order can accumulate
 * several emails (a resend, a later reminder for the same order).
 *
 * ChannelOrders/ChannelOrderLines are a staging area, deliberately
 * separate from Orders/OrderProducts: a channel's order arrives with
 * SKUs that may not match a console Product (finished goods aren't in
 * Products yet, and channel/QuickBooks SKUs drift through data-entry
 * errors), a buyer that may or may not already be a Person, and - for
 * Faire - possibly only some of its lines. Orders/OrderProducts/Pieces
 * require a resolved Product per line and drive scheduling, so a Channel
 * Order is only promoted to an Order once a person has reviewed it
 * (`orderId` records the result). Each line keeps the channel's own SKU,
 * description and price as received; `productId` is the match, if any.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    await queryInterface.createTable( 'InboundEmails', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      messageId: { type: DataTypes.STRING( 512 ), allowNull: false, unique: true },
      fromAddress: { type: DataTypes.STRING },
      subject: { type: DataTypes.STRING( 1024 ) },
      sentAt: { type: DataTypes.DATE },
      receivedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ) },
      raw: { type: DataTypes.BLOB( 'medium' ), allowNull: false },
      channel: { type: DataTypes.STRING( 32 ) },
      kind: { type: DataTypes.ENUM( 'new-order', 'other', 'unrecognized' ) },
      status: { type: DataTypes.ENUM( 'received', 'parsed', 'ignored', 'failed' ), allowNull: false, defaultValue: 'received' },
      error: { type: DataTypes.TEXT },
    } )

    await queryInterface.createTable( 'ChannelOrders', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      channel: { type: DataTypes.STRING( 32 ), allowNull: false },
      externalOrderId: { type: DataTypes.STRING( 64 ), allowNull: false },
      status: { type: DataTypes.ENUM( 'new', 'accepted', 'dismissed' ), allowNull: false, defaultValue: 'new' },
      orderedOn: { type: DataTypes.DATEONLY },
      requestedShipDate: { type: DataTypes.STRING },
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
      commission: { type: DataTypes.DECIMAL( 10, 2 ) },
      commissionLabel: { type: DataTypes.STRING },
      total: { type: DataTypes.DECIMAL( 10, 2 ) },
      notes: { type: DataTypes.TEXT },

      customerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'People', key: 'id' }, onDelete: 'SET NULL' },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Orders', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ) },
    } )

    await queryInterface.addIndex( 'ChannelOrders', ['channel', 'externalOrderId'], { unique: true } )
    await queryInterface.addIndex( 'ChannelOrders', ['status'] )

    await queryInterface.createTable( 'ChannelOrderLines', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      channelOrderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'ChannelOrders', key: 'id' }, onDelete: 'CASCADE' },
      position: { type: DataTypes.INTEGER, allowNull: false },
      sku: { type: DataTypes.STRING },
      description: { type: DataTypes.STRING( 1024 ) },
      unitPrice: { type: DataTypes.DECIMAL( 10, 2 ) },
      quantity: { type: DataTypes.FLOAT },
      productId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Products', key: 'id' }, onDelete: 'SET NULL' },
    } )

    await queryInterface.addIndex( 'InboundEmails', ['status'] )
    await queryInterface.addColumn( 'InboundEmails', 'channelOrderId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'ChannelOrders', key: 'id' },
      onDelete: 'SET NULL',
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'InboundEmails', 'channelOrderId' )
    await queryInterface.dropTable( 'ChannelOrderLines' )
    await queryInterface.dropTable( 'ChannelOrders' )
    await queryInterface.dropTable( 'InboundEmails' )
  },
}
