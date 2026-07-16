'use strict'

// Physical/process constants that drive the cost-profile system's
// computed default quantities (see 20260716000000-cost-profiles.js) but
// aren't themselves pricing policy, so they don't belong on RateProfile -
// feed rate and power draw convert a product's cut distance into machine
// run-time (which feeds both the utilities and CNC-labor cost factors),
// and the per-sq-in time constants seed the sanding/glueing/grouting
// labor-hour heuristics. All nullable with no default: unlike the
// company branding fields already on this table, there's no safe generic
// default for shop-specific numbers like these, so the cost-factor
// computation code treats "not yet configured" (null) as 0 rather than
// pretending a plausible-looking number was actually entered.
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Settings', 'feedRateInPerHr', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'powerDrawKwh', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'electricityRatePerKwh', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'sandingTimePerSqIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'glueingTimePerSqIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'groutingTimePerSqIn', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'Settings', 'groutingTimePerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'glueingTimePerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'sandingTimePerSqIn' )
    await queryInterface.removeColumn( 'Settings', 'electricityRatePerKwh' )
    await queryInterface.removeColumn( 'Settings', 'powerDrawKwh' )
    await queryInterface.removeColumn( 'Settings', 'feedRateInPerHr' )
  },
}
