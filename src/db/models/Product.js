import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// Unified Product/Material table. A row can be a purchasable end item
// (sellable: true), a raw material consumed by other products' bills of
// materials (via BillOfMaterial), or both at once. `type` is set (and a
// matching *Info row exists) for raw materials with type-specific
// dimensions; it's null for finished/assembled products that are just a
// bill of materials (e.g. a framed mosaic mirror made of several Products).
const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    sku: { type: DataTypes.STRING, unique: true, allowNull: false },
    type: { type: DataTypes.ENUM( 'bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile', 'other' ), allowNull: true },
    sellable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    // Whether this product should be shown anywhere customer-facing. Only
    // 'visible'/'hidden' for now; more values (e.g. 'discontinued') may be
    // added later.
    status: { type: DataTypes.ENUM( 'visible', 'hidden' ), allowNull: false, defaultValue: 'visible' },
    units: { type: DataTypes.STRING, defaultValue: 'each' },
    weight: { type: DataTypes.FLOAT },
    description: { type: DataTypes.TEXT },
    // Independent, manually-entered final prices - untouched by the cost-
    // profile system below, which is only a cost-breakdown reference tool.
    priceWholesale: { type: DataTypes.DECIMAL( 8, 2 ) },
    priceRetail: { type: DataTypes.DECIMAL( 8, 2 ) },
  },
  {
    timestamps: false,
  })

export default Product
