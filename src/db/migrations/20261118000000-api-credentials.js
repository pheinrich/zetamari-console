'use strict'

/*
 * OAuth credentials for sales-channel APIs the console calls on the
 * shop's behalf - one row per provider (so far 'etsy'). Etsy's refresh
 * token rotates on every use and its access token lasts an hour, so they
 * can't live in environment variables; the app's own key and secret
 * still do (ETSY_API_KEY, ETSY_SHARED_SECRET). Deliberately not on
 * Settings, whose row is read wholesale for the settings form.
 */
module.exports = {
  async up( queryInterface, Sequelize )
  {
    const { DataTypes } = Sequelize

    await queryInterface.createTable( 'ApiCredentials', {
      provider: { type: DataTypes.STRING( 32 ), primaryKey: true },
      accessToken: { type: DataTypes.TEXT },
      accessTokenExpiresAt: { type: DataTypes.DATE },
      refreshToken: { type: DataTypes.TEXT },
      accountId: { type: DataTypes.STRING },
      accountName: { type: DataTypes.STRING },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' ) },
    } )
  },

  async down( queryInterface )
  {
    await queryInterface.dropTable( 'ApiCredentials' )
  },
}
