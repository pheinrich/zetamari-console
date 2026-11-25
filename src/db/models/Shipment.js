import { DataTypes } from 'sequelize'

import sequelize from '@/db/sequelize.js'
import Order from '@/db/models/Order'
import Product from '@/db/models/Product'
import { TRANSPORT_MODES } from '@/utils/shipments'

// One physical hand-off of some or all of an Order's products - see
// CONTEXT.md's Shipment entry, docs/adr/0009, and libs/shipments.js for
// the rules. Its step is the first of pickedAt/packedAt/documentedAt/
// handedOffAt not yet set (utils/shipments.js's SHIPMENT_STEPS); carrier,
// service and tracking only apply to the carrier transport modes.
// `shipTo` has the shape of ChannelOrder.shipTo.
const Shipment = sequelize.define(
  'Shipment',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // Declared (and named in the associations below) so it's `orderId`, as
    // the table has it - left to belongsTo() it would be `OrderId`, and an
    // `orderId` passed to create() was silently dropped.
    orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: 'id' } },
    transportMode: { type: DataTypes.ENUM( ...TRANSPORT_MODES ) },
    carrier: { type: DataTypes.STRING },
    service: { type: DataTypes.STRING },
    tracking: { type: DataTypes.STRING },
    shipTo: { type: DataTypes.JSON },
    notes: { type: DataTypes.TEXT },
    createdOn: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    pickedAt: { type: DataTypes.DATE },
    packedAt: { type: DataTypes.DATE },
    documentedAt: { type: DataTypes.DATE },
    handedOffAt: { type: DataTypes.DATE },
  },
  {
    timestamps: false,
  })

Order.hasMany( Shipment, {foreignKey: 'orderId'} )
Shipment.belongsTo( Order, {foreignKey: 'orderId'} )

// What a Shipment carries, one row per product. A built product's
// quantity is the number of Pieces the Shipment claimed (Piece.shipmentId).
export const ShipmentLine = sequelize.define(
  'ShipmentLine',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Shipments', key: 'id' } },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    quantity: { type: DataTypes.DECIMAL( 12, 3 ), allowNull: false },
  },
  {
    timestamps: false,
  })

Shipment.hasMany( ShipmentLine, {as: 'Lines', foreignKey: 'shipmentId', onDelete: 'CASCADE'} )
ShipmentLine.belongsTo( Shipment, {foreignKey: 'shipmentId'} )
ShipmentLine.belongsTo( Product, {foreignKey: 'productId'} )

export default Shipment
