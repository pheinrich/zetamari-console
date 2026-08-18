import { DataTypes } from 'sequelize'

import bcrypt from 'bcryptjs'

import sequelize from '@/db/sequelize.js'

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },

    // Which of CONTEXT.md's Owner/Assistant this user is, for
    // manufacturing-scheduling purposes (see the Capacity Event entry
    // and the 20260816000000-user-role-and-weekly-hours.js migration) -
    // nullable for any future non-production login.
    role: { type: DataTypes.ENUM( 'owner', 'assistant' ) },
  },
  {
    timestamps: false,
  })

User.beforeCreate( async (user) => {
  user.password = await bcrypt.hash( user.password, 10 )
})

export default User
