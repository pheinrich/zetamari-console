import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A named daily assistant entry - see the 20260817030000-assistant-
// availabilities.js migration for the full rationale. `name` is
// freeform (no FK to Users - assistants aren't named User accounts);
// the UI suggests previously-used names but doesn't enforce a fixed
// roster. Feeds src/libs/pieceScheduling.js's simulateBacklog() as one
// summed pool per date, and is the source Grouting Day's expected
// assistant hours are computed from (see GroutingDay.js).
const AssistantAvailability = sequelize.define(
  'AssistantAvailability',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    hours: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  })

export default AssistantAvailability
