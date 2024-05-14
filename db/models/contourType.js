import {DataTypes} from 'sequelize'
import db from 'db'

const ContourType = db.define(
  'ContourType',
  {
    name: {type: DataTypes.STRING, allowNull: false},
    prefix: {type: DataTypes.STRING, allowNull: false}
  },
  {
    timestamps: true,
    tableName: 'contourTypes'
  })

export default ContourType
