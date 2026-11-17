import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'

// OAuth tokens for one sales-channel API ('etsy'), refreshed in place -
// see the 20261118000000-api-credentials migration. `accountId` is the
// connected account's id there (Etsy: the shop_id), `accountName` its
// display name. Never sent to the browser.
const ApiCredential = sequelize.define(
  'ApiCredential',
  {
    provider: { type: DataTypes.STRING( 32 ), primaryKey: true },
    accessToken: { type: DataTypes.TEXT },
    accessTokenExpiresAt: { type: DataTypes.DATE },
    refreshToken: { type: DataTypes.TEXT },
    accountId: { type: DataTypes.STRING },
    accountName: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
  })

export default ApiCredential
