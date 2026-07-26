'use strict'

/*
 * Renames Settings.powerDrawKwh -> powerDrawKw. This is a mislabeling fix,
 * not a unit conversion: the machine's power draw is a rate (kilowatts -
 * how fast it consumes energy while running), not an energy quantity
 * (kilowatt-hours - how much energy it's consumed over some period) - the
 * "h" was never meaningful and no shop-entered value needs rescaling,
 * just the column (and every reference to it) renamed to say what it
 * always actually meant.
 *
 * This also makes the constant usable the way it was always documented
 * as being used but never actually was (see db/actions/settings.js's
 * updateSettings()): Utilities' $/hr rate is now derived as
 * powerDrawKw x electricityRatePerKwh (kW x $/kWh = $/hr), the same
 * "computed from Machine settings, not manually entered" treatment
 * Machine Wear's rate got from the 20260728000000-bit-wear-cost-
 * factor.js migration.
 */
module.exports = {
  async up( queryInterface )
  {
    await queryInterface.renameColumn( 'Settings', 'powerDrawKwh', 'powerDrawKw' )
  },

  async down( queryInterface )
  {
    await queryInterface.renameColumn( 'Settings', 'powerDrawKw', 'powerDrawKwh' )
  },
}
