'use strict'

/*
 * Switches the six Labor CostFactors (design/CNC/sanding/glueing/
 * grouting/finishing) from hours to minutes - the computed quantities
 * for these are typically well under an hour, so their decimal-hour
 * values (e.g. 0.0833) were awkward to read/edit compared to a whole or
 * near-whole minute count. Machine-category factors (machineWear,
 * utilities) are untouched and stay in their existing units (in, hr).
 *
 * Converts existing data in place rather than just relabeling the unit,
 * so nothing's cost silently changes: CostFactors.unit becomes 'min',
 * every existing ProfileRate.rate for these factors is divided by 60
 * ($/hr -> $/min, same total $ per unit of real time), and any existing
 * ProductCostOverride.quantityOverride for these factors is multiplied
 * by 60 (hours -> minutes) so an override still represents the same
 * real-world duration.
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
    const ids = await laborFactorIds( queryInterface, Sequelize )
    if( !ids.length )
      return

    await queryInterface.sequelize.query( 'UPDATE `CostFactors` SET `unit` = ? WHERE `id` IN (?)', { replacements: ['min', ids] } )
    await queryInterface.sequelize.query( 'UPDATE `ProfileRates` SET `rate` = `rate` / 60 WHERE `costFactorId` IN (?)', { replacements: [ids] } )
    await queryInterface.sequelize.query(
      'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` * 60 WHERE `quantityOverride` IS NOT NULL AND `costFactorId` IN (?)',
      { replacements: [ids] }
    )
  },

  async down( queryInterface, Sequelize )
  {
    const ids = await laborFactorIds( queryInterface, Sequelize )
    if( !ids.length )
      return

    await queryInterface.sequelize.query(
      'UPDATE `ProductCostOverrides` SET `quantityOverride` = `quantityOverride` / 60 WHERE `quantityOverride` IS NOT NULL AND `costFactorId` IN (?)',
      { replacements: [ids] }
    )
    await queryInterface.sequelize.query( 'UPDATE `ProfileRates` SET `rate` = `rate` * 60 WHERE `costFactorId` IN (?)', { replacements: [ids] } )
    await queryInterface.sequelize.query( 'UPDATE `CostFactors` SET `unit` = ? WHERE `id` IN (?)', { replacements: ['hr', ids] } )
  },
}
