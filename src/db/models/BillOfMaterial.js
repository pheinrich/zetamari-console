import { DataTypes } from 'sequelize'
import sequelize from '@/db/sequelize.js'
import Product from '@/db/models/Product'

// Self-referential bill-of-materials join on Product. parentProductId is
// the assembly/finished product; materialProductId is the component
// product it consumes, at some quantity. Replaces the old ProductMaterial
// join (which linked the separate Product and Material tables).
const BillOfMaterial = sequelize.define(
  'BillOfMaterial',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    parentProductId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    materialProductId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
    validate: {
      notSelfReferential()
      {
        if( this.parentProductId === this.materialProductId )
          throw new Error( 'A product cannot list itself as a material.' )
      },
    },
  })

Product.belongsToMany( Product, { as: 'materials', through: BillOfMaterial, foreignKey: 'parentProductId', otherKey: 'materialProductId' } )
Product.belongsToMany( Product, { as: 'usedIn', through: BillOfMaterial, foreignKey: 'materialProductId', otherKey: 'parentProductId' } )

Product.hasMany( BillOfMaterial, { as: 'bomLines', foreignKey: 'parentProductId' } )
Product.hasMany( BillOfMaterial, { as: 'usedInLines', foreignKey: 'materialProductId' } )
BillOfMaterial.belongsTo( Product, { as: 'parent', foreignKey: 'parentProductId' } )
BillOfMaterial.belongsTo( Product, { as: 'material', foreignKey: 'materialProductId' } )

export default BillOfMaterial
