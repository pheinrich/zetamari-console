'use strict'

/*
 * Adds a third standard RateProfile kind, 'cogs' (Cost of Goods Sold),
 * alongside the existing 'wholesale'/'retail' - a dedicated pricing tier
 * for the Products list page's Cost column (see readProductsCogsCosts()
 * in db/actions/productCost.js), kept separate from the Wholesale/Retail
 * tiers since those may carry built-in markup rather than reflect true
 * production cost. Like those two, it's a single fixed profile (not
 * something products individually opt out of via a per-product FK - see
 * Products.wholesaleRateProfileId/retailRateProfileId, which have no COGS
 * counterpart) and isn't deletable at the app layer (rateProfile.js's
 * deleteRateProfile already blocks any kind !== 'custom').
 *
 * Seeded at rate 0 for every existing CostFactor, same as a brand new
 * custom profile (createRateProfile) - meant to be filled in via the
 * existing Rate Profiles CRUD UI, not guessed at here.
 */

async function findCogsProfileId( queryInterface, Sequelize )
{
  const rows = await queryInterface.sequelize.query(
    'SELECT `id` FROM `RateProfiles` WHERE `kind` = ?',
    { replacements: ['cogs'], type: Sequelize.QueryTypes.SELECT }
  )

  return rows[0]?.id
}

module.exports = {
  async up( queryInterface, Sequelize )
  {
    // MySQL ENUM columns need a full column redefinition to add a value -
    // there's no ALTER ... ADD VALUE like Postgres.
    await queryInterface.changeColumn( 'RateProfiles', 'kind', {
      type: Sequelize.DataTypes.ENUM( 'wholesale', 'retail', 'cogs', 'custom' ),
      allowNull: false,
    } )

    if( await findCogsProfileId( queryInterface, Sequelize ) )
      return

    await queryInterface.sequelize.query(
      'INSERT INTO `RateProfiles` (`name`, `kind`) VALUES (?, ?)',
      { replacements: ['COGS', 'cogs'] }
    )

    const profileId = await findCogsProfileId( queryInterface, Sequelize )
    const factors = await queryInterface.sequelize.query(
      'SELECT `id` FROM `CostFactors`',
      { type: Sequelize.QueryTypes.SELECT }
    )

    if( factors.length )
      await queryInterface.bulkInsert(
        'ProfileRates',
        factors.map( f => ({rateProfileId: profileId, costFactorId: f.id, rate: 0}) )
      )
  },

  async down( queryInterface, Sequelize )
  {
    const profileId = await findCogsProfileId( queryInterface, Sequelize )

    if( profileId )
    {
      await queryInterface.sequelize.query( 'DELETE FROM `ProfileRates` WHERE `rateProfileId` = ?', { replacements: [profileId] } )
      await queryInterface.sequelize.query( 'DELETE FROM `RateProfiles` WHERE `id` = ?', { replacements: [profileId] } )
    }

    await queryInterface.changeColumn( 'RateProfiles', 'kind', {
      type: Sequelize.DataTypes.ENUM( 'wholesale', 'retail', 'custom' ),
      allowNull: false,
    } )
  },
}
