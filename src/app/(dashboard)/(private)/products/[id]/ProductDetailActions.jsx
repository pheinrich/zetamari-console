'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteProduct } from '@/db/actions/product'

export default function ProductDetailActions( {product} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete()
  {
    if( !confirm( `Delete ${product.name}? This is blocked if it's still used as a material in another product.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteProduct( product.id )
        toast.success( 'Product deleted' )
        router.push( '/products' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the product - it may still be used as a material elsewhere' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/products/${product.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
