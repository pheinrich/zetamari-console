'use strict'

/*
 * Orders previously had no link to a customer at all - only `userId`
 * (which internal staff member handled it). Adds a nullable `customerId`
 * so an Order can be attributed to a Customer record, letting the new
 * Customer detail page show "orders placed by this customer" (2026-08-07
 * discussion). Nullable since older/imported orders, or orders from a
 * channel that never captured enough info to identify a Customer, won't
 * always have one to link.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Orders', 'customerId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Customers', key: 'id' },
      onDelete: 'SET NULL',
    } )

    await queryInterface.addIndex( 'Orders', ['customerId'] )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Orders', 'customerId' )
  },
}
