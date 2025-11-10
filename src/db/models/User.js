import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import bcrypt from 'bcryptjs'

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  })

User.beforeCreate( async (user) => {
  user.password = await bcrypt.hash( user.password, 10 )
})

export default User
