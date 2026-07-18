'use strict'

/*
 * Adds a new Material CostFactor, 'grout' - the cost of the grout
 * itself (area-based, same shape as tesserae/glass/substrate), distinct
 * from the existing 'laborGrouting' Labor factor (the time to apply
 * it). Seeded at rate 0, same as every other CostFactor's initial state -
 * set the real rate from the Settings page afterward.
 *
 * Also renames two existing CostFactors' key/label to match the
 * Product.type renames in 20260723000000-rename-product-types.js -
 * 'substrate' -> 'woodenBase' ("Wooden Base"), 'glass' -> 'mirrorGlass'
 * ("Mirror Glass") - so the cost-breakdown table's terminology matches
 * the renamed product types it's pricing. `rate`/`unit`/`category`/
 * `rateUnit` are untouched; this only touches the identifying key and
 * display label.
 */
module.exports = {
  async up( queryInterface )
  {
    await queryInterface.bulkInsert( 'CostFactors', [
      { key: 'grout', label: 'Grout', unit: 'sqin', category: 'material', rate: 0 },
    ] )

    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'woodenBase', `label` = 'Wooden Base' WHERE `key` = 'substrate'"
    )
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'mirrorGlass', `label` = 'Mirror Glass' WHERE `key` = 'glass'"
    )
  },

  async down( queryInterface )
  {
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'glass', `label` = 'Glass' WHERE `key` = 'mirrorGlass'"
    )
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'substrate', `label` = 'Substrate' WHERE `key` = 'woodenBase'"
    )

    await queryInterface.sequelize.query( "DELETE FROM `CostFactors` WHERE `key` = 'grout'" )
  },
}
