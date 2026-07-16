'use strict'

/*
 * Un-does just the rate half of 20260718000000-labor-quantities-to-
 * minutes.js for the six Labor CostFactors - their computed/overridden
 * *quantities* stay in minutes (still awkward in hours, per that
 * migration's rationale), but their $ *rates* on the Rate Profiles
 * pages are more intuitively entered per hour, not per minute (the
 * opposite tradeoff from quantities: rates are round, human-chosen
 * numbers like "$25/hr", not small measured durations).
 *
 * Rather than re-coupling quantity and rate to the same unit again,
 * this introduces CostFactors.rateUnit - the unit a factor's
 * ProfileRate.rate is quoted in, independent of CostFactors.unit (the
 * unit its quantity is tracked in). Null means "same as unit" (every
 * factor except these six). Cost calculations convert quantity from
 * `unit` to `rateUnit` before multiplying by rate - see
 * db/actions/productCost.js.
 */
const LABOR_FACTOR_KEYS = ['laborDesign', 'laborCnc', 'laborSanding', 'laborGlueing', 'laborGrouting', 'laborFinishing']

async function laborFactorIds( queryInterface, Sequelize )
{
  const rows = await queryInterface.sequelize.query(
    'SELECT `id` FROM `CostFactors` WHERE `key` IN (?)',
    { replacements: [LABOR_FACTOR_KEYS], type: Sequelize.QueryTypes.SELECT }
  )

  return rows.map( r => r.id )
}

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'CostFactors', 'rateUnit', { type: Sequelize.DataTypes.STRING, allowNull: true } )

    const ids = await laborFactorIds( queryInterface, Sequelize )
    if( !ids.length )
      return

    await queryInterface.sequelize.query( 'UPDATE `CostFactors` SET `rateUnit` = ? WHERE `id` IN (?)', { replacements: ['hr', ids] } )
    await queryInterface.sequelize.query( 'UPDATE `ProfileRates` SET `rate` = `rate` * 60 WHERE `costFactorId` IN (?)', { replacements: [ids] } )
  },

  async down( queryInterface, Sequelize )
  {
    const ids = await laborFactorIds( queryInterface, Sequelize )
    if( ids.length )
      await queryInterface.sequelize.query( 'UPDATE `ProfileRates` SET `rate` = `rate` / 60 WHERE `costFactorId` IN (?)', { replacements: [ids] } )

    await queryInterface.removeColumn( 'CostFactors', 'rateUnit' )
  },
}
