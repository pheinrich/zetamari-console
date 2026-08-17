import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'

// Total production hours a specific Owner or Assistant is expected to
// work in a given calendar week - see CONTEXT.md's Weekly Budget entry
// and the 20260816020000-weekly-budgets.js migration. `weekStartDate` is
// that week's Monday. Evenly divided across that week's business days to
// produce a default daily Capacity (see Capacity.js) when no day-
// specific value has been set; falls back to User.defaultWeeklyHours
// when no week-specific row exists.
const WeeklyBudget = sequelize.define(
  'WeeklyBudget',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    weekStartDate: { type: DataTypes.DATEONLY, allowNull: false },
    hours: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  })

User.hasMany( WeeklyBudget )
WeeklyBudget.belongsTo( User )

export default WeeklyBudget
