'use strict'

/*
 * Item 13 of the 2026-07-23 discussion: replaces the six independently-
 * rated Labor cost factors (Design/CNC/Sanding/Glueing/Grouting/
 * Finishing) with two shop-wide rates - Owner Labor $/hr and Assistant
 * Labor $/hr - while keeping each stage's own computed/overridable time
 * (see libs/costFactors.js's computeDefaultQuantities(), untouched by
 * this migration). Each stage now carries a "% Owner" split instead of
 * its own $/hr rate: `defaultOwnerSharePercent` is the shop-wide default
 * (editable from the Settings page, alongside the two new rate rows),
 * `ProductCostOverrides.ownerShareOverride` is the per-product override -
 * a third independent overridable field alongside the existing
 * quantityOverride/enabledOverride (see ProductCostOverride.js).
 *
 * `laborOwner`/`laborAssistant` are added as ordinary CostFactor rows so
 * their $/hr rate reuses the Settings page's existing Cost Factor Rates
 * table rather than needing new UI - but they don't behave like other
 * factors in the cost calculation (see db/actions/productCost.js): they
 * have no computed quantity of their own and never appear as a row in a
 * product's cost breakdown. They're looked up by key purely to get their
 * rate.
 *
 * Default % Owner split, per the 2026-07-24 discussion: Design/CNC/
 * Glueing default to 100% Owner, Sanding/Grouting/Finishing default to
 * an even 50/50 split - both starting points, freely adjustable per
 * factor (shop-wide) or per product (override).
 */
const OWNER_SHARE_DEFAULTS = {
  laborDesign: 100,
  laborCnc: 100,
  laborGlueing: 100,
  laborSanding: 50,
  laborGrouting: 50,
  laborFinishing: 50,
}

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'CostFactors', 'defaultOwnerSharePercent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )

    for( const [key, pct] of Object.entries( OWNER_SHARE_DEFAULTS ) )
      await queryInterface.sequelize.query(
        'UPDATE `CostFactors` SET `defaultOwnerSharePercent` = ? WHERE `key` = ?',
        { replacements: [pct, key] }
      )

    await queryInterface.bulkInsert( 'CostFactors', [
      { key: 'laborOwner', label: 'Owner Labor', unit: 'hr', category: 'labor', rate: 0 },
      { key: 'laborAssistant', label: 'Assistant Labor', unit: 'hr', category: 'labor', rate: 0 },
    ] )

    await queryInterface.addColumn( 'ProductCostOverrides', 'ownerShareOverride', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.removeColumn( 'ProductCostOverrides', 'ownerShareOverride' )
    await queryInterface.sequelize.query( "DELETE FROM `CostFactors` WHERE `key` IN ('laborOwner', 'laborAssistant')" )
    await queryInterface.removeColumn( 'CostFactors', 'defaultOwnerSharePercent' )
  },
}
