import { DataTypes } from 'sequelize'
import RateProfile from '@/db/models/RateProfile'
import CostFactor from '@/db/models/CostFactor'
import sequelize from '@/db/sequelize'

// RateProfile x CostFactor join: the $-per-unit rate a given pricing tier
// charges for a given cost factor (e.g. Retail's tesserae rate, in $ per
// CostFactor.unit). One row per (profile, factor) pair - seeded for the
// two default profiles in 20260716000000-cost-profiles.js, editable via
// the RateProfile CRUD UI.
const ProfileRate = sequelize.define(
  'ProfileRate',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rateProfileId: { type: DataTypes.INTEGER, allowNull: false, references: { model: RateProfile, key: 'id' } },
    costFactorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: CostFactor, key: 'id' } },
    rate: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  },
  {
    timestamps: false,
  })

RateProfile.hasMany( ProfileRate, { as: 'rates', foreignKey: 'rateProfileId' } )
CostFactor.hasMany( ProfileRate, { as: 'profileRates', foreignKey: 'costFactorId' } )
ProfileRate.belongsTo( RateProfile, { as: 'profile', foreignKey: 'rateProfileId' } )
ProfileRate.belongsTo( CostFactor, { as: 'factor', foreignKey: 'costFactorId' } )

export default ProfileRate
