import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Permission from '@/db/models/Permission'
import RolePermission from '@/db/models/RolePermission'

// A named bundle of Permissions a Person can be assigned (see PersonRole)
// - e.g. Admin, Owner, Assistant, Student, Retail Customer, Wholesale
// Customer. Replaces the old single-valued User.role ('owner'/'assistant')
// and Customer.type ('wholesale'/'retail') enums now that Person unifies
// both - a person can hold any number of Roles at once (e.g. an owner who
// is also an admin and takes classes). See the
// 20260917000000-roles-and-permissions.js migration for the seeded
// starter set.
const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

Role.belongsToMany( Permission, {through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId'} )
Permission.belongsToMany( Role, {through: RolePermission, foreignKey: 'permissionId', otherKey: 'roleId'} )

export default Role
