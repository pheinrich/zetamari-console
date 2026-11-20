'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { updateProductInfo } from '@/db/actions/product'
import { INFO_KEY } from '@/libs/productInfo'
import { formDataToDeepJSON } from '@/utils/formData'
import { productTypeMeta } from '../ProductTypeMeta'
import ProductInfoFields from '../ProductInfoFields'

// "piecesPerSheet" -> "Pieces Per Sheet", for error messages.
const fieldLabel = (key) => key.replace( /Id$/, '' ).replace( /([A-Z])/g, ' $1' ).replace( /^./, (c) => c.toUpperCase() )

// Popup on the Overview tab for adding/editing a product's type-specific
// details, using the same inputs as the full product form. The parent
// remounts it (via `key`) on each open, so the uncontrolled fields start
// from the latest saved details rather than a cancelled edit.
export default function EditProductInfoDialog( {open, setOpen, product, info, contourList} )
{
  const router = useRouter()
  const [error, setError] = useState( null )
  const [isPending, startTransition] = useTransition()

  const key = INFO_KEY[product.type]
  const label = productTypeMeta( product.type ).label

  function handleClose()
  {
    if( !isPending )
      setOpen( false )
  }

  function handleSubmit( e )
  {
    e.preventDefault()
    setError( null )

    const data = formDataToDeepJSON( new FormData( e.currentTarget ) )

    startTransition( async () => {
      const result = await updateProductInfo( product.id, data[key] ?? {} )

      if( result?.error )
      {
        const fields = Object.entries( result.fieldErrors ?? {} ).map( ([field, msgs]) => `${fieldLabel( field )}: ${msgs[0]}` )
        setError( {message: result.error, fields} )

        return
      }

      toast.success( `${label} details saved` )
      setOpen( false )
      router.refresh()
    })
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      closeAfterTransition={false}
    >
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>{info ? 'Edit' : 'Add'} {label} Details</div>
        <Typography component='span' className='flex flex-col text-center'>
          {product.name}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent className='flex flex-col gap-5 overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>

          {error && (
            <Alert severity='error'>
              {error.message}
              {error.fields.length > 0 && (
                <ul className='mbs-1 mbe-0 pis-5'>
                  {error.fields.map( (f) => <li key={f}>{f}</li> )}
                </ul>
              )}
            </Alert>
          )}

          <Grid container spacing={5}>
            <ProductInfoFields type={product.type} info={info} contourList={contourList} />
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
