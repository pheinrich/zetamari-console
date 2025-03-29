import Link from 'next/link'
import Supplier from '@/db/models/Supplier'
import SupplierMaterial from '@/db/models/SupplierMaterial'

export default async function SupplierMaterialView( {material, suppliers} )
{
  return (
    <div>
      <h2>Suppliers</h2>
      {suppliers.map( supplier => (
        <div key={supplier.id}>{supplier.name}: {supplier.SupplierMaterial.cost}/{material.units}</div>
      ))}
    </div>
  )
}
