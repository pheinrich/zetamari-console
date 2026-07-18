'use strict'

/*
 * Collapses the RateProfile/ProfileRate system down to a single COGS rate
 * per CostFactor plus two shop-wide multipliers - the multiple-rate-
 * profile design (standard Wholesale/Retail, opt-in custom profiles per
 * product, and the just-added 'cogs' kind) turned out to be more than was
 * actually needed. From here on:
 *
 *   - CostFactors.rate is the one $/unit COGS rate for that factor
 *     (editable from the Settings page now, alongside the existing
 *     process constants - see settings.js/SettingsForm.jsx).
 *   - Settings.wholesaleMultiplier/retailMultiplier scale a product's
 *     COGS total up into its Wholesale/Retail cost-breakdown figures
 *     (wholesaleCost = cogsCost * wholesaleMultiplier, etc. - see
 *     db/actions/productCost.js). Both start at 1 (no markup) rather
 *     than a guessed value - review and set the real markup on the
 *     Settings page after this runs.
 *   - RateProfiles/ProfileRates and Products.wholesaleRateProfileId/
 *     retailRateProfileId (the per-product custom-profile opt-in) are
 *     gone entirely - there's only ever the one rate per factor now.
 *
 * CostFactors.rate is seeded from the 'wholesale' RateProfile's rates
 * (not the brand-new 'cogs' one, which was only ever seeded at 0 - see
 * 20260721000000-add-cogs-rate-profile.js) since Wholesale is the profile
 * that's actually had real values configured through the Rate Profiles
 * UI. Any custom-profile/retail-profile rates that differed from
 * Wholesale are not preserved - there's nowhere left for that
 * information to live once profiles are gone.
 */

const FK_WHOLESALE = 'products_wholesale_rate_profile_id_fkey'
const FK_RETAIL = 'products_retail_rate_profile_id_fkey'

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'CostFactors', 'rate', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    } )

    await queryInterface.sequelize.query(
      `UPDATE \`CostFactors\` cf
       JOIN \`ProfileRates\` pr ON pr.costFactorId = cf.id
       JOIN \`RateProfiles\` rp ON rp.id = pr.rateProfileId AND rp.kind = 'wholesale'
       SET cf.rate = pr.rate`
    )

    await queryInterface.addColumn( 'Settings', 'wholesaleMultiplier', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    } )
    await queryInterface.addColumn( 'Settings', 'retailMultiplier', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    } )

    await queryInterface.removeConstraint( 'Products', FK_RETAIL )
    await queryInterface.removeConstraint( 'Products', FK_WHOLESALE )
    await queryInterface.removeColumn( 'Products', 'retailRateProfileId' )
    await queryInterface.removeColumn( 'Products', 'wholesaleRateProfileId' )

    await queryInterface.dropTable( 'ProfileRates' )
    await queryInterface.dropTable( 'RateProfiles' )
  },

  async down( queryInterface, Sequelize )
  {
    // Recreates the schema (RateProfiles/ProfileRates/Products' FK
    // columns) but not the actual rate data those tables held - that was
    // dropped along with them in up() and can't be reconstructed from
    // CostFactors.rate alone (it only ever remembers one profile's worth
    // of rates). Every RateProfile ends up with all-zero ProfileRates,
    // same starting point as a brand new custom profile.
    await queryInterface.createTable( 'RateProfiles', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
      kind: { type: Sequelize.DataTypes.ENUM( 'wholesale', 'retail', 'cogs', 'custom' ), allowNull: false },
    } )

    await queryInterface.createTable(
      'ProfileRates',
      {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        rateProfileId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'RateProfiles', key: 'id' },
          onDelete: 'CASCADE',
        },
        costFactorId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'CostFactors', key: 'id' },
          onDelete: 'CASCADE',
        },
        rate: { type: Sequelize.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      },
      {
        uniqueKeys: [
          { name: 'profile_rate_unique', fields: ['rateProfileId', 'costFactorId'] }
        ]
      } )

    for( const [name, kind] of [['Wholesale', 'wholesale'], ['Retail', 'retail'], ['COGS', 'cogs']] )
      await queryInterface.sequelize.query(
        'INSERT INTO `RateProfiles` (`name`, `kind`) VALUES (?, ?)',
        { replacements: [name, kind] }
      )

    await queryInterface.addColumn( 'Products', 'wholesaleRateProfileId', { type: Sequelize.DataTypes.INTEGER, allowNull: true } )
    await queryInterface.addColumn( 'Products', 'retailRateProfileId', { type: Sequelize.DataTypes.INTEGER, allowNull: true } )

    await queryInterface.addConstraint( 'Products', {
      fields: ['wholesaleRateProfileId'],
      type: 'foreign key',
      name: FK_WHOLESALE,
      references: { table: 'RateProfiles', field: 'id' },
      onDelete: 'SET NULL',
    } )
    await queryInterface.addConstraint( 'Products', {
      fields: ['retailRateProfileId'],
      type: 'foreign key',
      name: FK_RETAIL,
      references: { table: 'RateProfiles', field: 'id' },
      onDelete: 'SET NULL',
    } )

    await queryInterface.removeColumn( 'Settings', 'retailMultiplier' )
    await queryInterface.removeColumn( 'Settings', 'wholesaleMultiplier' )
    await queryInterface.removeColumn( 'CostFactors', 'rate' )
  },
}
