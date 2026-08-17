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
// salvage a deadline). `phase` is one of CONTEXT.md's eight Production
// Phases (grown from the original six by 20260817000000-piece-phase-
// picking-glass.js) - which phases a given Piece actually passes
// through, and in what order, depends on its Product's type ('kit' vs
// "finished" - see src/libs/pieceScheduling.js's PHASE_SEQUENCES).
// Grouping Pieces onto a shared Grouting Day is a scheduling
// convenience, not a rule enforced here - see CONTEXT.md's Grouting
// Day entry and docs/adr/0006.
const Piece = sequelize.define(
  'Piece',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: 'id' } },
    phase: {
      type: DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Picking', 'Gluing', 'Grouting', 'Glass', 'Finishing' ),
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
