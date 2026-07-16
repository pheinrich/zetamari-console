'use strict'

/*
 * Flips the units of two process constants introduced in
 * 20260716020000-settings-process-constants.js, without changing what
 * they mean to costFactors.js's computeDefaultQuantities() (still "how
 * long does an operation take, given a distance/area") - just how the
 * shop enters the number:
 *
 * - feedRateInPerHr (in/hr) -> feedRateInPerMin (in/min): CNC feed rates
 *   are conventionally specified per minute, not per hour.
 * - sandingTimePerSqIn / glueingTimePerSqIn / groutingTimePerSqIn
 *   (hr/sq-in, a time-per-area heuristic) -> sandingRateSqInPerHr /
 *   glueingRateSqInPerHr / groutingRateSqInPerHr (sq-in/hr, a throughput
 *   heuristic - "how much area can one operator get through in an
 *   hour"), matching the Feed Rate field's "bigger number = faster"
 *   framing instead of the old "bigger number = slower" one.
 *
 * Existing values are converted in place rather than just renamed, so a
 * shop that had already configured these keeps the same real-world
 * meaning: feed rate divides by 60 (in/hr -> in/min), the three labor
 * constants take a reciprocal (time-per-area -> area-per-time). A stored
 * 0 for one of the labor constants (nonsensical either way - it would
 * have meant "instantaneous" under the old unit) is left as 0 rather
 * than inverted to null or Infinity.
 */
const LABOR_RENAMES = [
  ['sandingTimePerSqIn', 'sandingRateSqInPerHr'],
  ['glueingTimePerSqIn', 'glueingRateSqInPerHr'],
  ['groutingTimePerSqIn', 'groutingRateSqInPerHr'],
]

module.exports = {
  async up( queryInterface )
  {
    await queryInterface.renameColumn( 'Settings', 'feedRateInPerHr', 'feedRateInPerMin' )
    await queryInterface.sequelize.query( 'UPDATE `Settings` SET `feedRateInPerMin` = `feedRateInPerMin` / 60 WHERE `feedRateInPerMin` IS NOT NULL' )

    for( const [oldName, newName] of LABOR_RENAMES )
    {
      await queryInterface.renameColumn( 'Settings', oldName, newName )
      await queryInterface.sequelize.query(
        `UPDATE \`Settings\` SET \`${newName}\` = 1 / \`${newName}\` WHERE \`${newName}\` IS NOT NULL AND \`${newName}\` <> 0`
      )
    }
  },

  async down( queryInterface )
  {
    for( const [oldName, newName] of LABOR_RENAMES )
    {
      await queryInterface.sequelize.query(
        `UPDATE \`Settings\` SET \`${newName}\` = 1 / \`${newName}\` WHERE \`${newName}\` IS NOT NULL AND \`${newName}\` <> 0`
      )
      await queryInterface.renameColumn( 'Settings', newName, oldName )
    }

    await queryInterface.sequelize.query( 'UPDATE `Settings` SET `feedRateInPerMin` = `feedRateInPerMin` * 60 WHERE `feedRateInPerMin` IS NOT NULL' )
    await queryInterface.renameColumn( 'Settings', 'feedRateInPerMin', 'feedRateInPerHr' )
  },
}
