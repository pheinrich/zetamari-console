'use strict'

/*
 * Adds an eighth Labor stage CostFactor, "Picking" (key='laborPicking'),
 * for sorting/selecting tesserae pieces before they're glued down - a
 * step that wasn't tracked anywhere before now (2026-08-05 discussion).
 *
 * Follows the same convention as the other seven Labor stage factors (see
 * 20260725000000-owner-assistant-labor.js): unit='min' (quantity tracked
 * in minutes, per 20260718000000-labor-quantities-to-minutes.js),
 * rateUnit='hr' (rate quoted per hour, per 20260719000000-labor-rate-
 * unit-hours.js), rate itself unused (per 20260726000000-cogs-formula-
 * v2.js, a Labor stage row's $ figure comes from computeLaborSplit()'s
 * Owner/Assistant split against the laborOwner/laborAssistant rate-holder
 * factors, not its own `rate`).
 *
 * defaultOwnerSharePercent=100: like Glass Hand-Cutting (laborGlass),
 * Picking is always done by the Owner - there's no Assistant-share
 * default to set. Still overridable per-product via
 * ProductCostOverride.ownerShareOverride, same as any other Labor stage.
 *
 * Unlike laborGlass (which has no general heuristic and defaults its
 * quantity to a flat 0), Picking time IS estimated from geometry - a new
 * Settings.pickingRateSqInPerHr constant (added here, Labor Heuristics
 * card in SettingsForm.jsx) scales a product's mosaic surface area into
 * minutes, same shape as the existing Sanding/Gluing/Grouting rates -
 * see libs/costFactors.js's computeDefaultQuantities(). Unlike those
 * three (which are nullable and default to 0 minutes until a shop
 * configures them), Picking gets a real, non-null default (300 sq-in/hr)
 * baked in at the column level - same "this constant is universal enough
 * to ship a sane default" treatment as markupPercent/retailMultiplier/
 * the Wooden Base Sheet's sheetWidthIn/sheetHeightIn - so a shop that
 * never touches Settings still gets a non-zero Picking estimate.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.bulkInsert( 'CostFactors', [
      {
        key: 'laborPicking',
        label: 'Picking',
        unit: 'min',
        rateUnit: 'hr',
        category: 'labor',
        rate: 0,
        defaultOwnerSharePercent: 100,
      },
    ] )

    await queryInterface.addColumn( 'Settings', 'pickingRateSqInPerHr', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 300,
    } )
  },

  async down( queryInterface, Sequelize )
  {
    const [factor] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'laborPicking'", { type: Sequelize.QueryTypes.SELECT }
    )

    if( factor )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
      await queryInterface.sequelize.query( 'DELETE FROM `CostFactors` WHERE `id` = ?', { replacements: [factor.id] } )
    }

    await queryInterface.removeColumn( 'Settings', 'pickingRateSqInPerHr' )
  },
}
