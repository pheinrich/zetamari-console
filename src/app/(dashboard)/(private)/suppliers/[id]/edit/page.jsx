import Link from 'next/link'
import { notFound } from 'next/navigation'
import SupplierForm from '../../SupplierForm'
import { readSupplier } from '@/db/actions/supplier'

export default async function EditSupplierPage( {params} )
{
  const {id} = await params
  const supplier = await readSupplier( id )
  if( !supplier )
    return notFound()

  return (
    <>
      <SupplierForm initialData={supplier} />
      <hr />
      <Link href={`/suppliers/${id}`}>Cancel</Link><br/>
      <Link href='/suppliers'>All Suppliers</Link>
    </>
  )
}
