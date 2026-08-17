import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Order from '@/db/models/Order'

// A single physical unit of a product being produced, corresponding to
// one unit of quantity on an order line - see CONTEXT.md's Piece entry
// and the 20260816040000-pieces.js migration for the full rationale,
// including why this links directly to Product/Order rather than
// through OrderProduct.
//
// `orderId` is mutable: Pieces of the same product are fungible until
// shipped, and may rarely be reassigned to a different order (e.g. to
// salvage a deadline). `phase` is one of CONTEXT.md's six Production
// Phases; Grouting/Finishing happen per-order as a batch once every
// Piece on that order has cleared its pre-Grouting phases - that gate is
// enforced in application logic, not here.
const Piece = sequelize.define(
  'Piece',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: 'id' } },
    phase: {
      type: DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Gluing', 'Grouting', 'Finishing' ),
      allowNull: false,
      defaultValue: 'Design',
    },
  },
  {
    timestamps: false,
  })

Product.hasMany( Piece )
Piece.belongsTo( Product )

Order.hasMany( Piece )
Piece.belongsTo( Order )

export default Piece
