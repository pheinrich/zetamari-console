'use strict'

/*
 * Two Channel Order changes:
 *
 * ChannelOrders.shippingMethod: the delivery mechanism the channel named
 * ("USPS Priority Mail", "UPS Ground (2-7 days)"), when it named one.
 *
 * ChannelOrderOrders replaces ChannelOrders.orderId. Orders can now be
 * split (some lines moved to a new Order) and combined (several merged
 * into one), so a Channel Order may end up behind several Orders, and an
 * Order may carry several Channel Orders - the link is many-to-many.
 * Each existing orderId becomes one link row. A Channel Order is
 * 'accepted' while it has at least one link.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    await queryInterface.addColumn( 'ChannelOrders', 'shippingMethod', {type: DataTypes.STRING, allowNull: true, after: 'requestedShipDate'} )

    // The app's sequelize.sync() creates this table (empty, without the
    // cascades) if the new code runs before this migration does - replace it.
    await queryInterface.dropTable( 'ChannelOrderOrders', {} ).catch( () => {} )

    await queryInterface.createTable( 'ChannelOrderOrders', {
      channelOrderId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'ChannelOrders', key: 'id' }, onDelete: 'CASCADE' },
      orderId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
    } )

    await queryInterface.addIndex( 'ChannelOrderOrders', ['orderId'] )

    await queryInterface.sequelize.query(
      'INSERT INTO ChannelOrderOrders (channelOrderId, orderId) SELECT id, orderId FROM ChannelOrders WHERE orderId IS NOT NULL'
    )

    await queryInterface.removeConstraint( 'ChannelOrders', 'ChannelOrders_ibfk_2' )
    await queryInterface.removeColumn( 'ChannelOrders', 'orderId' )
  },

  async down( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    await queryInterface.addColumn( 'ChannelOrders', 'orderId', {
      type: DataTypes.INTEGER, allowNull: true, references: { model: 'Orders', key: 'id' }, onDelete: 'SET NULL',
    } )

    // Lossy when a Channel Order is linked to several Orders: keeps the first.
    await queryInterface.sequelize.query(
      'UPDATE ChannelOrders c SET orderId = (SELECT MIN(l.orderId) FROM ChannelOrderOrders l WHERE l.channelOrderId = c.id)'
    )

    await queryInterface.dropTable( 'ChannelOrderOrders' )
    await queryInterface.removeColumn( 'ChannelOrders', 'shippingMethod' )
  },
}
