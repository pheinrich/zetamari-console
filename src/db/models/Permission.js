import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A single grantable capability (e.g. 'orders.view', 'orders.edit') that
// one or more Roles can bundle in via RolePermission - see Role.js. Data
// model only for now: nothing in the app enforces these yet (AuthGuard
// just checks for a logged-in session) - this is the foundation the real
// access-control pass will build on later.
const Permission = sequelize.define(
  'Permission',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

export default Permission
