'use strict'

/*
 * Adds a seventh Labor stage CostFactor, "Glass Hand-Cutting"
 * (key='laborGlass'), for the Visualizer rework (2026-08-01 discussion):
 * some mirror glass shapes require hand-cutting rather than the CNC, and
 * that time wasn't tracked anywhere before now.
 *
 * Follows the same convention as the other six Labor stage factors (see
 * 20260725000000-owner-assistant-labor.js): unit='min' (quantity tracked
 * in minutes, per 20260718000000-labor-quantities-to-minutes.js),
 * rateUnit='hr' (rate quoted per hour, per 20260719000000-labor-rate-
 * unit-hours.js), rate itself unused (per 20260726000000-cogs-formula-
 * v2.js, a Labor stage row's $ figure comes from computeLaborSplit()'s
 * Owner/Assistant split against the laborOwner/laborAssistant rate-holder
 * factors, not its own `rate`).
 *
 * defaultOwnerSharePercent=100: unlike the other six stages (which have a
 * shop-configured mix of Owner/Assistant time), hand-cutting glass is
 * always done by the Owner - there's no Assistant-share default to set.
 * Still overridable per-product via ProductCostOverride.ownerShareOverride,
 * same as any other Labor stage.
 *
 * libs/costFactors.js's computeDefaultQuantities() gains a flat
 * `laborGlass: 0` default quantity (this migration doesn't touch that
 * file) - unlike Design/Finishing's flat non-zero defaults, there's no
 * general heuristic for "does this shape need hand-cutting," so it
 * defaults to 0 (no hand-cutting assumed) and relies entirely on a
 * per-product override when it applies.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.bulkInsert( 'CostFactors', [
      {
        key: 'laborGlass',
        label: 'Glass Hand-Cutting',
        unit: 'min',
        rateUnit: 'hr',
        category: 'labor',
        rate: 0,
        defaultOwnerSharePercent: 100,
      },
    ] )
  },

  async down( queryInterface, Sequelize )
  {
    const [factor] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'laborGlass'", { type: Sequelize.QueryTypes.SELECT }
    )

    if( factor )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
      await queryInterface.sequelize.query( 'DELETE FROM `CostFactors` WHERE `id` = ?', { replacements: [factor.id] } )
    }
  },
}
