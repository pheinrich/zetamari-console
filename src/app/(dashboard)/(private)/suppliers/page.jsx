import Link from 'next/link'
import { deleteSupplier, readSuppliers } from '@/db/actions/supplier'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'
import { ToastContainer } from 'react-toastify'

export default async function SuppliersPage()
{
  const suppliers = await readSuppliers()

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteSupplier( id )
  }

  return (
    <div>
      <ToastContainer />
      <h1>Suppliers List</h1>
      <Link href='/suppliers/new'>+ New Supplier</Link>
      <ul>
        {suppliers.map( supplier => (
          <li key={supplier.id}>
            [{supplier.id}] <Link href={`/suppliers/${supplier.id}`}>{supplier.name}</Link>
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
          </li>
        ))}
      </ul>
    </div>
  )
}
