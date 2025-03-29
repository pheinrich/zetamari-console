import { DataTypes } from 'sequelize'
import Supplier from '@/db/models/Supplier'
import Material from '@/db/models/Material'
import sequelize from '@/db/sequelize.js'

const SupplierMaterial = sequelize.define(
  'SupplierMaterial',
  {
    supplierId: { type: DataTypes.INTEGER, references: { model: Supplier, key: 'id' } },
    materialId: { type: DataTypes.INTEGER, references: { model: Material, key: 'id' } },
    partNumber: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING },
    cost: { type: DataTypes.FLOAT },
  },
  {
    timestamps: false,
  })

Supplier.belongsToMany( Material, { through: SupplierMaterial, as: 'materials' } )
Material.belongsToMany( Supplier, { through: SupplierMaterial, as: 'suppliers' } )

export default SupplierMaterial
