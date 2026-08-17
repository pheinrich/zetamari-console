import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'

// The hours a specific Owner or Assistant can work production on a given
// calendar day - see CONTEXT.md's Capacity entry and the
// 20260816010000-capacities.js migration. A single shared pool per
// person per day, not tracked separately per Production Phase; falls
// back to WeeklyBudget (see WeeklyBudget.js) when no day-specific row
// exists for a (user, date) pair.
const Capacity = sequelize.define(
  'Capacity',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    hours: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  })

User.hasMany( Capacity )
Capacity.belongsTo( User )

export default Capacity
