'use strict'

/*
 * ShipmentLines.picked: how much of a Shipment line has been picked so
 * far, so products are checked off one row at a time as they're
 * collected (none, some or all of a row) rather than the whole Shipment
 * being marked picked at once. A Shipment's pickedAt is now set by
 * itself when every line is fully picked, and cleared when one isn't.
 * Lines of Shipments already past Picking start fully picked.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'ShipmentLines', 'picked', {type: Sequelize.DataTypes.DECIMAL( 12, 3 ), allowNull: false, defaultValue: 0} )

    await queryInterface.sequelize.query(
      'UPDATE ShipmentLines l JOIN Shipments s ON s.id = l.shipmentId SET l.picked = l.quantity WHERE s.pickedAt IS NOT NULL'
    )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'ShipmentLines', 'picked' )
  },
}
