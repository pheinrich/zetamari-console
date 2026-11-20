'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'

import { deleteProduct } from '@/db/actions/product'

// Warning -> delete -> "Deleted" confirmation, following the template's
// ConfirmationDialog, but cancelling just closes (no "Cancelled" step).
export default function DeleteProductDialog( {open, setOpen, product} )
{
  const router = useRouter()
  const [deleted, setDeleted] = useState( false )
  const [error, setError] = useState( null )
  const [isPending, startTransition] = useTransition()

  const usedInCount = product.usedInCount ?? 0

  function handleClose()
  {
    if( isPending )
      return

    setOpen( false )
    setError( null )
  }

  function handleDelete()
  {
    setError( null )

    startTransition( async () => {
      try
      {
        await deleteProduct( product.id )
        setOpen( false )
        setDeleted( true )
      }
      catch( err )
      {
        setError( 'Failed to delete the product - it may still be used as a material elsewhere.' )
      }
    })
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
          <div className='flex flex-col items-center gap-2'>
            <Typography variant='h4'>Are you sure?</Typography>
            <Typography color='text.primary'>
              You won&#39;t be able to revert deleting {product.name}!
            </Typography>
            {usedInCount > 0 && (
              <Alert severity='warning' className='mbs-2 text-start'>
                This product is a material in {usedInCount} other product{usedInCount === 1 ? '' : 's'}, so deleting it
                will be blocked until it&#39;s removed from their bills of materials.
              </Alert>
            )}
            {error && <Alert severity='error' className='mbs-2 text-start'>{error}</Alert>}
          </div>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='error' onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Yes, Delete Product!'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleted} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='ri-checkbox-circle-line text-[88px] mbe-6 text-success' />
          <Typography variant='h4' className='mbe-2'>Deleted</Typography>
          <Typography color='text.primary'>{product.name} has been deleted.</Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='success' onClick={() => router.push( '/products' )}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
