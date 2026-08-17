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
// `estimatedAssistantHours` is manually entered and adjustable - not
// derived from any named User's Capacity (volunteers aren't tracked as
// Users at all). Owners' own extended hours on this date reuse the
// existing per-day Capacity override instead of a column here.
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
    estimatedAssistantHours: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

export default GroutingDay
