import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'
import ShapeType from '@/db/models/ShapeType'

const Contour = sequelize.define(
  'Contour',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    svgData: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

// Every contour belongs to a shape family (see ShapeType.js) - aliased
// `shape` rather than `shapeType` (the old ENUM column this replaced) so
// `contour.shape` (the eager-loaded {id, name, key, description} row)
// can't be confused with what used to be a plain string. Code that needs
// the parametric buildFromType() dispatch key now reads
// `contour.shape?.key` instead of the old `contour.shapeType`.
Contour.belongsTo( ShapeType, {as: 'shape', allowNull: false, foreignKey: 'shapeTypeId'} )

export default Contour
