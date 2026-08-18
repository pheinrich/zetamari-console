import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'
import CapacityEvent from '@/db/models/CapacityEvent'

// One assigned Owner or Assistant on a CapacityEvent, plus their per-day
// capacity for that event's span - see CapacityEvent.js and the
// 20260817050000-capacity-events.js migration. Exactly one of userId
// (Owner - a real User) / assistantName (freeform, no FK - assistants
// aren't named User accounts) is set, enforced by a DB-level CHECK
// constraint, not just here.
//
// `capacity` is a JSON array of per-day hours with a "last value
// repeats" shorthand for the event's full span - see
// src/libs/pieceScheduling.js's expandCapacityEvents() for how it's
// unpacked, and db/actions/capacity.js's upsertCapacityEvent() for the
// "no two Events may give the same person overlapping days" rule this
// relies on to stay unambiguous.
const CapacityEventPerson = sequelize.define(
  'CapacityEventPerson',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    capacityEventId: { type: DataTypes.INTEGER, allowNull: false, references: { model: CapacityEvent, key: 'id' } },
    userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
    assistantName: { type: DataTypes.STRING, allowNull: true },
    capacity: { type: DataTypes.JSON, allowNull: false },
  },
  {
    timestamps: false,
  })

CapacityEvent.hasMany( CapacityEventPerson, {foreignKey: 'capacityEventId', onDelete: 'CASCADE'} )
CapacityEventPerson.belongsTo( CapacityEvent, {foreignKey: 'capacityEventId'} )
User.hasMany( CapacityEventPerson )
CapacityEventPerson.belongsTo( User )

export default CapacityEventPerson
