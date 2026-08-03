'use strict'

/*
 * Fixes a spelling error: "Glueing" -> "Gluing" (the correct spelling)
 * everywhere it appears as a stored value - the Gluing Labor CostFactor's
 * key/label (laborGlueing/'Glueing Labor' -> laborGluing/'Gluing Labor')
 * and Settings' glueingRateSqInPerHr column (-> gluingRateSqInPerHr).
 * Purely cosmetic/naming - no formula or behavior change (libs/
 * costFactors.js, configurationCost.js, StatsSummary.jsx, and
 * SettingsForm.jsx are all updated in the same commit to reference the
 * renamed column/key).
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'laborGluing', `label` = 'Gluing Labor' WHERE `key` = 'laborGlueing'"
    )

    await queryInterface.renameColumn( 'Settings', 'glueingRateSqInPerHr', 'gluingRateSqInPerHr' )
  },

  async down( queryInterface, Sequelize )
  {
    await queryInterface.sequelize.query(
      "UPDATE `CostFactors` SET `key` = 'laborGlueing', `label` = 'Glueing Labor' WHERE `key` = 'laborGluing'"
    )

    await queryInterface.renameColumn( 'Settings', 'gluingRateSqInPerHr', 'glueingRateSqInPerHr' )
  },
}
