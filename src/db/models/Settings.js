import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A single-row table holding organization-wide preferences - company
// name/logo used to brand printed calculator reports, plus the physical/
// process constants the cost-profile system's computed default
// quantities are derived from (see the 20260716000000-cost-profiles.js
// migration): feed rate and power draw convert a product's cut distance
// into machine run-time (feeding both the utilities and CNC-labor cost
// factors), and the sq-in/hr throughput constants seed the sanding/
// glueing/grouting labor-hour heuristics. These are shop facts, not
// pricing policy, which is why they live here rather than on
// RateProfile. Always read/written as the first (and only) row - see
// src/db/actions/settings.js - rather than a true key-value store, since
// there's only ever one of these.
const Settings = sequelize.define(
  'Settings',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
    feedRateInPerMin: { type: DataTypes.FLOAT },
    powerDrawKwh: { type: DataTypes.FLOAT },
    electricityRatePerKwh: { type: DataTypes.FLOAT },
    sandingRateSqInPerHr: { type: DataTypes.FLOAT },
    glueingRateSqInPerHr: { type: DataTypes.FLOAT },
    groutingRateSqInPerHr: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

export default Settings
