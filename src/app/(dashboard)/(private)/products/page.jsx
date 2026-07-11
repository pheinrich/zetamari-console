import Link from 'next/link'
import { deleteProduct, readProducts } from '@/db/actions/product'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'
import { ToastContainer } from 'react-toastify'

export default async function ProductsPage()
{
  const products = await readProducts()

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteProduct( id )
  }

  return (
    <div>
      <ToastContainer />
      <h1>Products & Materials List</h1>
      <Link href='/products/new'>+ New Product</Link>
      <ul>
        {products.map( product => (
          <li key={product.id}>
            [{product.id}] <Link href={`/products/${product.id}`}>{product.name}</Link> ({product.sku})
            {product.type ? `: ${product.type}` : ''}
            {product.sellable ? ' - sellable' : ''}
            <RedirectButton targetUrl={`/products/${product.id}/edit`} label='Edit' />
            <ActionButton
              action={serverAction}
              id={product.id}
              label='Delete'
              labelPending='Deleting...'
              targetUrl='/products'
              confirmMsg='Are you sure you want to delete the product? This is blocked if it is still used as a material in another product.'
              successMsg='Product sucessfully deleted'
              failMsg='Failed to delete the product'
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
