'use strict'

/*
 * Adds the shop's average-bit-life/cost inputs to Settings, and
 * reformulates the Machine Wear cost factor around them:
 *
 * - bitLifeSheetsPerBit (sheets/bit): how many full sheets one bit cuts
 *   before it needs replacing.
 * - cuttingTimeMinPerSheet (min/sheet): how long a typical sheet takes to
 *   cut - a general machine-throughput constant, not bit-specific on its
 *   own, but combined with bitLifeSheetsPerBit it gives the bit's working
 *   life in minutes, and further combined with feedRateInPerMin it gives
 *   the bit's working life in cut inches.
 * - bitCostPerBit ($/bit): the replacement cost per bit - divided by the
 *   bit's working life (in whichever unit is needed) to get a per-sheet,
 *   per-minute, or per-inch bit cost.
 *
 * See libs/bitWear.js for the derived-value math (shared by
 * SettingsForm.jsx, to show what these currently work out to, and
 * db/actions/settings.js's updateSettings(), which keeps the Machine Wear
 * CostFactor's rate in sync with them on every Settings save).
 *
 * Machine Wear and Utilities are also switched to both track quantity the
 * same way - a product's total cutting time in minutes, same as CNC labor
 * - rather than Machine Wear's previous cut-distance-in-inches and
 * Utilities' previous hours:
 *   - machineWear: unit 'in' -> 'min', rateUnit -> 'hr'. Its rate is no
 *     longer a manually-entered $/in figure - it's now $/hr, derived from
 *     Bit Cost / Bit Working Life (see updateSettings()), which is why
 *     the existing $/in rate isn't converted here - it's meaningless
 *     under the new quantity unit regardless, and gets overwritten the
 *     next time Settings are saved with the new bit fields filled in.
 *   - utilities: unit 'hr' -> 'min', rateUnit -> 'hr'. Its $/hr rate is
 *     unchanged (only the quantity's unit changed, not the rate's) -
 *     costFactors.js's convertToRateUnit() divides the minutes back down
 *     to hours before multiplying, same as every Labor factor already
 *     does.
 *
 * Existing per-product ProductCostOverride.quantityOverride rows are
 * converted in place so they keep the same real-world meaning:
 * utilities' hours -> minutes is an unconditional x60 (same as the
 * 20260718000000-labor-quantities-to-minutes.js precedent); machineWear's
 * inches -> minutes depends on the shop's feedRateInPerMin (minutes =
 * inches / feed rate), which is only applied if that constant is actually
 * configured (a positive number) - if it's null/0, there's no way to
 * convert an inches figure into minutes at all, so any existing machine-
 * wear override is left as-is (now silently mislabeled as minutes) rather
 * than guessed at; worth a manual look after this migration if the shop
 * had any such overrides before configuring Feed Rate.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Settings', 'bitLifeSheetsPerBit', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'cuttingTimeMinPerSheet', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )
    await queryInterface.addColumn( 'Settings', 'bitCostPerBit', { type: Sequelize.DataTypes.FLOAT, allowNull: true } )

    const [[settingsRow]] = await queryInterface.sequelize.query(
      'SELECT `feedRateInPerMin` FROM `Settings` LIMIT 1'
    )

    const feedRate = settingsRow?.feedRateInPerMin

    const [[machineWear]] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'machineWear' LIMIT 1"
    )

    const [[utilities]] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'utilities' LIMIT 1"
    )

    if( machineWear )
    {
      await queryInterface.sequelize.query(
        "UPDATE `CostFactors` SET `unit` = 'min', `rateUnit` = 'hr' WHERE `id` = ?",
        { replacements: [machineWear.id] }
      )

      if( feedRate > 0 )
        await queryInterface.sequelize.query(
          'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` / ? WHERE `quantityOverride` IS NOT NULL AND `costFactorId` = ?',
          { replacements: [feedRate, machineWear.id] }
        )
    }

    if( utilities )
    {
      await queryInterface.sequelize.query(
        "UPDATE `CostFactors` SET `unit` = 'min', `rateUnit` = 'hr' WHERE `id` = ?",
        { replacements: [utilities.id] }
      )
      await queryInterface.sequelize.query(
        'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` * 60 WHERE `quantityOverride` IS NOT NULL AND `costFactorId` = ?',
        { replacements: [utilities.id] }
      )
    }
  },

  async down( queryInterface )
  {
    const [[settingsRow]] = await queryInterface.sequelize.query(
      'SELECT `feedRateInPerMin` FROM `Settings` LIMIT 1'
    )

    const feedRate = settingsRow?.feedRateInPerMin

    const [[machineWear]] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'machineWear' LIMIT 1"
    )

    const [[utilities]] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'utilities' LIMIT 1"
    )

    if( utilities )
    {
      await queryInterface.sequelize.query(
        'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` / 60 WHERE `quantityOverride` IS NOT NULL AND `costFactorId` = ?',
        { replacements: [utilities.id] }
      )
      await queryInterface.sequelize.query(
        "UPDATE `CostFactors` SET `unit` = 'hr', `rateUnit` = NULL WHERE `id` = ?",
        { replacements: [utilities.id] }
      )
    }

    if( machineWear )
    {
      if( feedRate > 0 )
        await queryInterface.sequelize.query(
          'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` * ? WHERE `quantityOverride` IS NOT NULL AND `costFactorId` = ?',
          { replacements: [feedRate, machineWear.id] }
        )

      await queryInterface.sequelize.query(
        "UPDATE `CostFactors` SET `unit` = 'in', `rateUnit` = NULL WHERE `id` = ?",
        { replacements: [machineWear.id] }
      )
    }

    await queryInterface.removeColumn( 'Settings', 'bitCostPerBit' )
    await queryInterface.removeColumn( 'Settings', 'cuttingTimeMinPerSheet' )
    await queryInterface.removeColumn( 'Settings', 'bitLifeSheetsPerBit' )
  },
}
