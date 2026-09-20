import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Person from '@/db/models/Person'
import Role from '@/db/models/Role'

// Which Roles a Person holds - many-to-many, since a real person often
// holds several at once (e.g. an Owner who's also an Admin and takes
// classes as a Student). Replaces the old single-valued User.role and
// Customer.type enum columns entirely.
const PersonRole = sequelize.define(
  'PersonRole',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    personId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Person, key: 'id' } },
    roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Role, key: 'id' } },
  },
  {
    timestamps: false,
  })

Person.belongsToMany( Role, {through: PersonRole, foreignKey: 'personId', otherKey: 'roleId'} )
Role.belongsToMany( Person, {through: PersonRole, foreignKey: 'roleId', otherKey: 'personId'} )

export default PersonRole
