import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A single-row table holding organization-wide preferences - currently
// just the company name/logo used to brand printed calculator reports.
// Always read/written as the first (and only) row - see
// src/db/actions/settings.js - rather than a true key-value store, since
// there's only ever one of these.
const Settings = sequelize.define(
  'Settings',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  })

export default Settings
