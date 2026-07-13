import { DataTypes } from 'sequelize'
import Image from '@/db/models/Image'
import Product from '@/db/models/Product'
import sequelize from '@/db/sequelize.js'

// Join table attaching a shared Image to a Product, in gallery order.
// Deleting a ProductImage row only unlinks the image from that product -
// it never deletes the underlying Image, since other products may still
// reference it.
const ProductImage = sequelize.define(
  'ProductImage',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    imageId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Image, key: 'id' } },
    // Lowest sortOrder is the product's primary/thumbnail image.
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    timestamps: false,
  })

Product.belongsToMany( Image, { through: ProductImage, as: 'images', foreignKey: 'productId', otherKey: 'imageId' } )
Image.belongsToMany( Product, { through: ProductImage, as: 'products', foreignKey: 'imageId', otherKey: 'productId' } )

Product.hasMany( ProductImage, { as: 'productImages', foreignKey: 'productId' } )
Image.hasMany( ProductImage, { as: 'productImages', foreignKey: 'imageId' } )
ProductImage.belongsTo( Product, { as: 'product', foreignKey: 'productId' } )
ProductImage.belongsTo( Image, { as: 'image', foreignKey: 'imageId' } )

export default ProductImage
