import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'
import Material from '@/db/models/Material'

const ProductMaterial = sequelize.define(
  'ProductMaterial',
  {
    productId: { type: DataTypes.INTEGER, references: { model: Product, key: id } },
    materialId: { type: DataTypes.INTEGER, references: { model: Material, key: id } },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    width: { type: DataTypes.FLOAT, defaultValue: 1.0 },
    height: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  },
  {
    timestamps: false,
  })

Product.belongsToMany( Material, { through: ProductMaterial } )
Material.belongsToMany( Product, { through: ProductMaterial } )

export default ProductMaterial
