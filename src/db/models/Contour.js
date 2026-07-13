import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'

const Contour = sequelize.define(
  'Contour',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    svgData: { type: DataTypes.TEXT },
    // Only meaningful (and required) for "basic shape" contours - i.e. ones
    // with no svgData. Tells buildFromType() (@/libs/mirror) which of the 7
    // parametric shapes to draw. Unused when svgData is set, since geometry
    // is traced from the path data directly in that case. `unique: true` so
    // there's at most one contour per basic shape type.
    shapeType: {
      type: DataTypes.ENUM( 'chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica picscis' ),
      allowNull: true,
      unique: true,
    },
  },
  {
    timestamps: false,
  })

export default Contour
