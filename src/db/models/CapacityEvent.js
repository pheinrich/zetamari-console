import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'

// CONTEXT.md's Capacity Event - a named, colored, date-spanning entry
// that's now the *only* way explicit Capacity gets entered (see the
// 20260817050000-capacity-events.js migration and the retired Capacity/
// WeeklyBudget/AssistantAvailability tables it replaced). Who's assigned
// and their per-day hours live on CapacityEventPerson, not here.
const CapacityEvent = sequelize.define(
  'CapacityEvent',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },

    // MUI theme color name (e.g. 'primary', 'success') the calendar
    // renders this event's bar in - a free choice by whoever creates
    // the event, not derived from who's assigned.
    color: { type: DataTypes.STRING, allowNull: false, defaultValue: 'primary' },
    notes: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

export default CapacityEvent
