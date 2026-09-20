import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// The join row behind Role<->Permission's belongsToMany (declared on
// Role.js, which imports this file). roleId/permissionId are declared
// explicitly, matching the reasoning in CustomerSource.js/
// LiveClassAttendee.js, rather than leaving them to belongsToMany to
// create implicitly.
const RolePermission = sequelize.define(
  'RolePermission',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    permissionId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
  })

export default RolePermission
