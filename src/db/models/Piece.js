import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Order from '@/db/models/Order'
import Shipment from '@/db/models/Shipment'

// A single physical unit of a product being produced, corresponding to
// one unit of quantity on an order line - see CONTEXT.md's Piece entry
// and the 20260816040000-pieces.js migration for the full rationale,
// including why this links directly to Product/Order rather than
// through OrderProduct.
//
// After its sequence's last phase a Piece is 'Ready': made, and counted
// into Stock if its Product is tracked (see db/actions/piece.js).
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
      type: DataTypes.ENUM( 'Design', 'CNC', 'Sanding', 'Assembly', 'Gluing', 'Grouting', 'Glass', 'Finishing', 'Ready' ),
      allowNull: false,
      defaultValue: 'Design',
    },
    // The Shipment that claimed this Piece, once one has - from then on
    // it's no longer fungible (see CONTEXT.md's Shipment).
    shipmentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Shipment, key: 'id' } },
  },
  {
    timestamps: false,
  })

Product.hasMany( Piece )
Piece.belongsTo( Product )

Order.hasMany( Piece )
Piece.belongsTo( Order )

Shipment.hasMany( Piece, {foreignKey: 'shipmentId'} )
Piece.belongsTo( Shipment, {foreignKey: 'shipmentId'} )

export default Piece
