'use strict'

/*
 * Sales tax on Channel Orders. Etsy and Squarespace collect it, so
 * without a column of its own subtotal + shipping - discount wouldn't
 * add up to total, and a later QuickBooks Estimate needs it as its own
 * line. IndieMe/Faire/Artful Home don't report tax (null).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'ChannelOrders', 'tax', {
      type: Sequelize.DataTypes.DECIMAL( 10, 2 ),
      allowNull: true,
      after: 'discount',
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'ChannelOrders', 'tax' )
  },
}
