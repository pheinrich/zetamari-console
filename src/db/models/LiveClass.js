import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Location from '@/db/models/Location'

// One of Angie's live-taught classes - in-person (her studio, a partner
// venue) or online (Zoom) - as opposed to her self-guided online
// learning products, which stay plain Products and are never modeled
// here. See the 20260807030000-live-classes.js migration for the full
// rationale. Enrollment lives on LiveClassAttendee (see that model), not
// here - this is just the class itself.
//
// Its schedule lives entirely on BasicEvent now (see that model and
// docs/adr/0008) - `startDate`/`endDate` here were dropped by the
// 20260917020000-basic-events.js migration, since a class's schedule is
// its one-or-more occurrences (e.g. a multi-session class), not a single
// range. hasMany(BasicEvent) is wired in BasicEvent.js, which this file
// doesn't need to import directly.
const LiveClass = sequelize.define(
  'LiveClass',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    locationType: { type: DataTypes.ENUM( 'in_person', 'online' ), allowNull: false, defaultValue: 'in_person' },
    locationId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Location, key: 'id' } },   // see Location.js
    cost: { type: DataTypes.FLOAT },
    notes: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

Location.hasMany( LiveClass, {foreignKey: 'locationId'} )
LiveClass.belongsTo( Location, {foreignKey: 'locationId'} )

export default LiveClass
