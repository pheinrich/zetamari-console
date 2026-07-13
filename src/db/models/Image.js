import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'

// A shared pool of S3-hosted images, referenced by URL rather than stored
// as blobs. A single Image row may be attached to several products at once
// (see ProductImage) - it is not owned by any one product.
const Image = sequelize.define(
  'Image',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING, unique: true, allowNull: false },
    altText: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  })

export default Image
