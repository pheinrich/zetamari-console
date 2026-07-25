import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize'
import Product from '@/db/models/Product'

// Shape "families" a Contour can belong to - the grouping label the
// calculator's "Copy From..." product picker (and anything else that
// wants a human name for "what shape is this") uses. Independent of
// which specific Contour row: a custom shape's Outside/Inside/Rabbet
// contours are separate rows that all point at the same ShapeType.
//
// `key` is only set for the 7 shapes buildFromType() (@/libs/mirror) can
// draw parametrically from width/height alone (the original hardcoded
// ENUM this table replaces - see the 20260715000000-shape-types.js
// migration); it's null for shapes that only ever exist as svgData-
// traced contours.
const ShapeType = sequelize.define(
  'ShapeType',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    key: { type: DataTypes.STRING, unique: true, allowNull: true },
    description: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  })

// The Wooden Base product whose outside contour/dimensions/border seed a
// brand-new shape when this family is picked from the Visualizer's "New"
// dropdown (see NewShapeMenu.jsx and MirrorCalculator.jsx's
// handleNewShape) - see the 20260727000000-shape-type-prototype.js
// migration. Only meaningful for key-bearing (basic/parametric) shape
// families, since only those appear in that dropdown, but nothing
// enforces that at the schema level. Set/cleared via a "Set as
// Prototype" button on the prototype product's own page
// (WoodenBaseInfoView.jsx) - there's no dedicated ShapeType admin UI.
ShapeType.belongsTo( Product, {as: 'prototypeWoodenBase', allowNull: true, defaultValue: null} )

export default ShapeType
