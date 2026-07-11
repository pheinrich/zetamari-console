import { DataTypes } from 'sequelize'
import Supplier from '@/db/models/Supplier'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize.js'

// Per-supplier pricing for a product. A product can come from zero or more
// suppliers, each charging its own price. Replaces SupplierMaterial.
const SupplierProduct = sequelize.define(
  'SupplierProduct',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    supplierId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Supplier, key: 'id' } },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    partNumber: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING },
    cost: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

Supplier.belongsToMany( Product, { through: SupplierProduct, as: 'products', foreignKey: 'supplierId', otherKey: 'productId' } )
Product.belongsToMany( Supplier, { through: SupplierProduct, as: 'suppliers', foreignKey: 'productId', otherKey: 'supplierId' } )

Supplier.hasMany( SupplierProduct, { as: 'productPrices', foreignKey: 'supplierId' } )
Product.hasMany( SupplierProduct, { as: 'supplierPrices', foreignKey: 'productId' } )
SupplierProduct.belongsTo( Supplier, { as: 'supplier', foreignKey: 'supplierId' } )
SupplierProduct.belongsTo( Product, { as: 'product', foreignKey: 'productId' } )

export default SupplierProduct
