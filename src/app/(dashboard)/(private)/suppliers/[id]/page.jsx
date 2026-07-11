import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteSupplier, readSupplier } from '@/db/actions/supplier'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'

export default async function SupplierPage( {params} )
{
  const {id} = await params
  const supplier = await readSupplier( id, true )

  if( !supplier )
    return notFound()

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteSupplier( id )
  }

  return (
    <div>
      <h1>Supplier: {supplier.name}</h1>
      <RedirectButton targetUrl={`/suppliers/${supplier.id}/edit`} label='Edit' />
      <ActionButton
        action={serverAction}
        id={supplier.id}
        label='Delete'
        labelPending='Deleting...'
        targetUrl='/suppliers'
        confirmMsg='Are you sure you want to delete the supplier? This also removes its pricing on all products.'
        successMsg='Supplier sucessfully deleted'
        failMsg='Failed to delete the supplier'
      />

      <div>Email: {supplier.email}</div>
      <div>Address: {supplier.address}</div>
      <div>Phone: {supplier.phone}</div>
      <div>URL: {supplier.url}</div>
      <div>Notes: {supplier.notes}</div>

      <h2>Products Priced by This Supplier</h2>
      <ul>
        {(supplier.products || []).map( (product) => (
          <li key={product.SupplierProduct.id}>
            <Link href={`/products/${product.id}`}>{product.name}</Link>: {product.SupplierProduct.partNumber} - {product.SupplierProduct.cost}
          </li>
        ))}
        {(!supplier.products || supplier.products.length === 0) && (
          <li>Not linked to any products yet. Add pricing from a product&apos;s page.</li>
        )}
      </ul>

      <hr />
      <Link href='/suppliers'>All Suppliers</Link>
    </div>
  )
}
