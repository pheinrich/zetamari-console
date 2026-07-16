'use strict'

/*
 * Adds a "Bill of Materials" CostFactor (key='bom', unit='$', category=
 * 'material') alongside tesserae/glass/substrate, so the calculator's
 * area-based estimate for those three factors can eventually be
 * superseded, product by product, by real BillOfMaterial line costs -
 * see the follow-up migrations that add ProductCostOverride.
 * enabledOverride (the per-factor include/exclude checkbox) and
 * BillOfMaterial.supplierId (which supplier's cost a BOM line uses).
 *
 * Unlike the other material factors, this one's "quantity" (computed in
 * libs/costFactors.js) is already a dollar figure - the sum of each BOM
 * line's quantity times its chosen supplier's cost - so its rate seeds
 * at 1 for every existing profile (wholesale, retail, and any custom
 * ones already created), a pass-through rather than a per-sq-in price.
 * A profile can still be edited to scale it (e.g. a bulk-discount or
 * overhead multiplier) like any other rate.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query(
      "INSERT INTO `CostFactors` (`key`, `label`, `unit`, `category`) VALUES ('bom', 'Bill of Materials', '$', 'material')"
    )

    const [[factor], profiles] = await Promise.all([
      queryInterface.sequelize.query( "SELECT `id` FROM `CostFactors` WHERE `key` = 'bom'", { type: Sequelize.QueryTypes.SELECT } ),
      queryInterface.sequelize.query( 'SELECT `id` FROM `RateProfiles`', { type: Sequelize.QueryTypes.SELECT } ),
    ])

    for( const profile of profiles )
      await queryInterface.sequelize.query(
        'INSERT INTO `ProfileRates` (`rateProfileId`, `costFactorId`, `rate`) VALUES (?, ?, 1)',
        { replacements: [profile.id, factor.id] }
      )
  },

  async down( queryInterface, Sequelize )
  {
    const [factor] = await queryInterface.sequelize.query(
      "SELECT `id` FROM `CostFactors` WHERE `key` = 'bom'", { type: Sequelize.QueryTypes.SELECT }
    )

    if( factor )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProfileRates` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
      await queryInterface.sequelize.query( 'DELETE FROM `ProductCostOverrides` WHERE `costFactorId` = ?', { replacements: [factor.id] } )
    }

    await queryInterface.sequelize.query( "DELETE FROM `CostFactors` WHERE `key` = 'bom'" )
  },
}
