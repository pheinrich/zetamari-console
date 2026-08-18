import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'

// CONTEXT.md's Grouting Day - the periodic shop event when Grouting and
// Finishing work happens for "finished" (non-kit) orders, staffed by
// the two Owners plus a pool of occasional volunteer Assistants whose
// turnout is unknown until they respond. See the
// 20260817010000-grouting-days.js migration for the full rationale,
// and docs/adr/0006-grouting-day-is-a-sticky-first-come-first-served-
// reservation.md for why this is a stateful reservation rather than a
// value recomputed fresh on every read (the deliberate exception to
// docs/adr/0005's lazy-cache pattern).
//
// Expected assistant hours for this date aren't stored here - they're
// computed on demand as the sum of that date's assistant CapacityEvent
// entries (see the 20260817040000-drop-grouting-day-estimated-hours.js
// migration and src/libs/pieceScheduling.js's simulateBacklog(), which
// attaches the sum to its result under `assistantHours`). Owners' own
// extended hours on this date come from a CapacityEvent the same way.
const GroutingDay = sequelize.define(
  'GroutingDay',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
    origin: {
      type: DataTypes.ENUM( 'explicit', 'computed' ),
      allowNull: false,
      defaultValue: 'computed',
    },
  },
  {
    timestamps: false,
  })

export default GroutingDay
