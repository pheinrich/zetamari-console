import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// An art show or conference Angie sells/teaches at (see the
// 20260807010000-events.js migration for the full rationale) - one table
// with a `type` discriminator rather than two, since both kinds share
// the same shape. Deliberately light for now - just enough to give
// CustomerSource (see that model) a real, reusable record to link a
// source to instead of a loose string, for shows/conferences that recur
// year over year.
const Event = sequelize.define(
  'Event',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM( 'art_show', 'conference' ), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    boothNumber: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
  },
  {
    timestamps: false,
  })

export default Event
