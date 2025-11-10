import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import User from '@/db/models/User'

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdOn: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    completedOn: { type: DataTypes.DATEONLY },
    packedOn: { type: DataTypes.DATEONLY },
  },
  {
    timestamps: false,
  })

User.hasMany( Order )
Order.belongsTo( User )

export default Product
