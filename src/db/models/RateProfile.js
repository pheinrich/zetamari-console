import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'

// A named pricing tier - the two system defaults (kind='wholesale'/
// 'retail', exactly one row each, not deletable at the app layer though
// their rates are freely editable) plus any number of custom named
// profiles (kind='custom') a product can opt into for one or both tiers
// instead of the standard profile - see Product.wholesaleRateProfileId/
// retailRateProfileId. Per-factor $ rates live in ProfileRate.
const RateProfile = sequelize.define(
  'RateProfile',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    kind: { type: DataTypes.ENUM( 'wholesale', 'retail', 'custom' ), allowNull: false },
  },
  {
    timestamps: false,
  })

export default RateProfile
