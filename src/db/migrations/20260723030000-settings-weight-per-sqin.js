'use strict'

/*
 * Four weight-per-square-inch shop constants, one per area-based
 * Material CostFactor (tesserae/mirrorGlass/grout/woodenBase) - lets
 * productCost.js's computeProductWeight() turn each factor's already-
 * computed area (the same figure its $ cost is derived from) into a
 * weight contribution, without needing a separate "weight" quantity
 * tracked anywhere. Nullable/no default, same as the other process
 * constants on this table (feedRateInPerMin etc.) - unset means "not
 * configured yet", not "zero", so an incomplete setup doesn't silently
 * under-report computed weight.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Settings', 'tesseraeWeightPerSqIn', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
    await queryInterface.addColumn( 'Settings', 'mirrorGlassWeightPerSqIn', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
    await queryInterface.addColumn( 'Settings', 'groutWeightPerSqIn', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
    await queryInterface.addColumn( 'Settings', 'woodenBaseWeightPerSqIn', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Settings', 'woodenBaseWeightPerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'groutWeightPerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'mirrorGlassWeightPerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'tesseraeWeightPerSqIn' )
  },
}
