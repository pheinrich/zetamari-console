import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Event from '@/db/models/Event'
import LiveClass from '@/db/models/LiveClass'

// The simplified calendar entry that replaced CapacityEvent - see
// docs/adr/0008 and CONTEXT.md's Basic Event entry. Deliberately plain:
// Title, Start Datetime, End Datetime, Color, Description - no capacity/
// people-hours concept, that's deferred to a future redesign.
//
// `eventId`/`liveClassId` are both nullable and mutually exclusive (see
// the CHECK constraint in the 20260917020000-basic-events.js migration):
// a Basic Event can stand alone on the /calendar page, or belong to one
// Event (an art show/conference) or one LiveClass as one of its
// occurrences - e.g. a multi-day show with different hours each day is
// several Basic Events, not one. Participants (see
// BasicEventParticipant.js) attach to the Basic Event, not the parent,
// so a show's Tuesday-only volunteer isn't recorded on days they didn't
// work.
const BasicEvent = sequelize.define(
  'BasicEvent',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    startDatetime: { type: DataTypes.DATE, allowNull: false },
    endDatetime: { type: DataTypes.DATE, allowNull: false },

    // MUI theme color name (e.g. 'primary', 'success') the calendar
    // renders this event's bar in - same free-choice-token convention
    // the retired CapacityEvent used.
    color: { type: DataTypes.STRING, allowNull: false, defaultValue: 'primary' },
    description: { type: DataTypes.TEXT },

    eventId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Event, key: 'id' } },
    liveClassId: { type: DataTypes.INTEGER, allowNull: true, references: { model: LiveClass, key: 'id' } },
  },
  {
    timestamps: false,
  })

Event.hasMany( BasicEvent, {foreignKey: 'eventId', onDelete: 'CASCADE'} )
BasicEvent.belongsTo( Event, {foreignKey: 'eventId'} )

LiveClass.hasMany( BasicEvent, {foreignKey: 'liveClassId', onDelete: 'CASCADE'} )
BasicEvent.belongsTo( LiveClass, {foreignKey: 'liveClassId'} )

export default BasicEvent
