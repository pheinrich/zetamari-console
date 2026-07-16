'use strict'

// Lets a product opt into a custom RateProfile (see 20260716000000-cost-
// profiles.js) for one or both pricing tiers, instead of the standard
// Wholesale/Retail profile - e.g. a "Special Pieces" custom profile
// replacing just the retail tier. Both columns are nullable: null means
// "use the standard profile of that kind," which is the default/common
// case, so most products never need a row here at all beyond the two
// null columns. Product.priceWholesale/priceRetail are unaffected - they
// stay independent, manually-entered fields; this is only used by the
// cost-breakdown reference tool, not wired into those.
const FK_WHOLESALE = 'products_wholesale_rate_profile_id_fkey'
const FK_RETAIL = 'products_retail_rate_profile_id_fkey'

module.exports = {
  async up( queryInterface, Sequelize )
  {
    await queryInterface.addColumn( 'Products', 'wholesaleRateProfileId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    })
    await queryInterface.addColumn( 'Products', 'retailRateProfileId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    })

    await queryInterface.addConstraint( 'Products', {
      fields: ['wholesaleRateProfileId'],
      type: 'foreign key',
      name: FK_WHOLESALE,
      references: { table: 'RateProfiles', field: 'id' },
      onDelete: 'SET NULL',
    })
    await queryInterface.addConstraint( 'Products', {
      fields: ['retailRateProfileId'],
      type: 'foreign key',
      name: FK_RETAIL,
      references: { table: 'RateProfiles', field: 'id' },
      onDelete: 'SET NULL',
    })
  },

  async down( queryInterface )
  {
    await queryInterface.removeConstraint( 'Products', FK_RETAIL )
    await queryInterface.removeConstraint( 'Products', FK_WHOLESALE )
    await queryInterface.removeColumn( 'Products', 'retailRateProfileId' )
    await queryInterface.removeColumn( 'Products', 'wholesaleRateProfileId' )
  },
}
