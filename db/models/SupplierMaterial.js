import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Supplier from '@/db/models/Supplier'
import Material from '@/db/models/Material'

const SupplierMaterial = sequelize.define(
  'SupplierMaterial',
  {
    supplierId: { type: DataTypes.INTEGER, references: { model: Supplier, key: id } },
    materialId: { type: DataTypes.INTEGER, references: { model: Material, key: id } },
    url: { type: DataTypes.STRING },
    cost: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

Supplier.belongsToMany( Material, { through: SupplierMaterial } )
Material.belongsToMany( Supplier, { through: SupplierMaterial } )

export default SupplierMaterial
