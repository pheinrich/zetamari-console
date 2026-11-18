'use strict'

/*
 * InboundEmails.kind gains 'forward': an order email someone forwarded
 * by hand (e.g. a historical order), as opposed to the Gmail filter's
 * auto-forward - see src/libs/channelOrders/forwarded.js. Emails it
 * carries as attachments become InboundEmails of their own.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.changeColumn( 'InboundEmails', 'kind', {
      type: Sequelize.DataTypes.ENUM( 'new-order', 'other', 'unrecognized', 'forward' ),
      allowNull: true,
    } )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query( "UPDATE InboundEmails SET kind = NULL WHERE kind = 'forward'" )
    await queryInterface.changeColumn( 'InboundEmails', 'kind', {
      type: Sequelize.DataTypes.ENUM( 'new-order', 'other', 'unrecognized' ),
      allowNull: true,
    } )
  },
}
