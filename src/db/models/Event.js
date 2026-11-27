import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Address from '@/db/models/Address'

// An art show or conference Angie sells/teaches at (see the
// 20260807010000-events.js migration for the full rationale) - one table
// with a `type` discriminator rather than two, since both kinds share
// the same shape. Deliberately light for now - just enough to give
// CustomerSource (see that model) a real, reusable record to link a
// source to instead of a loose string, for shows/conferences that recur
// year over year.
//
// Its schedule lives entirely on BasicEvent now (see that model and
// docs/adr/0008) - `startDate`/`endDate` here were dropped by the
// 20260917020000-basic-events.js migration, since a show's schedule is
// its one-or-more occurrences (varying hours per day), not a single
// range. hasMany(BasicEvent) is wired in BasicEvent.js, which this file
// doesn't need to import directly.
const Event = sequelize.define(
  'Event',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM( 'art_show', 'conference' ), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    addressId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Address, key: 'id' } },   // see Address.js
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    boothNumber: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  })

Event.belongsTo( Address, {foreignKey: 'addressId'} )

export default Event
