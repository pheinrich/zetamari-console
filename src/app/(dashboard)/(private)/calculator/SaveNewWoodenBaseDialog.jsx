'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createProduct } from '@/db/actions/product'

const schema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  type: z.literal( 'wooden base' ),
  woodenBaseInfo: z.object({
    outsideId: z.coerce.number().int(),
    insideId: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().int().optional() ),
    rabbetId: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().int().optional() ),
    width: z.coerce.number(),
    height: z.coerce.number(),
    border: z.coerce.number(),
  }),
})

// Renamed from SaveAsProductDialog - see the "Save New Wooden Base.../
// Save New Mirror Glass..." split in MirrorCalculator.jsx (the Visualizer
// is used to create both product types, but the working panel only ever
// tracks one contour + width/height/border, which maps directly onto
// WoodenBaseInfo - see SaveNewMirrorGlassDialog.jsx for the other type).
// Deliberately a small standalone form (just name/sku) rather than the
// full ProductForm - this is meant to be a quick "fork this into
// inventory" action, not a replacement for editing the product afterward.
export default function SaveNewWoodenBaseDialog( {open, onClose, substrateInfo} )
{
  const router = useRouter()
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: createProduct
  })

  useEffect( () => {
    if( !success )
      return

    onClose()
    router.push( '/products' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success] )

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{component: 'form', onSubmit: handleSubmit}}>
      <DialogTitle>Save New Wooden Base</DialogTitle>
      <DialogContent>
        <DialogContentText className='mbe-4'>
          This creates a new Wooden Base Product in your inventory using the shape, dimensions, and contours
          currently shown in the Visualizer. This can&rsquo;t be undone automatically - you&rsquo;ll be able to edit
          or delete the product afterward from the Products list.
        </DialogContentText>

        {errors && (
          <Alert severity='error' className='mbe-4'>
            <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
          </Alert>
        )}

        <Stack spacing={4}>
          <TextField fullWidth autoFocus label='Name' name='name' required />
          <TextField fullWidth label='SKU' name='sku' required />
        </Stack>

        <input type='hidden' name='type' value='wooden base' />
        <input type='hidden' name='woodenBaseInfo.outsideId' value={substrateInfo.outsideId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.insideId' value={substrateInfo.insideId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.rabbetId' value={substrateInfo.rabbetId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.width' value={substrateInfo.width ?? ''} />
        <input type='hidden' name='woodenBaseInfo.height' value={substrateInfo.height ?? ''} />
        <input type='hidden' name='woodenBaseInfo.border' value={substrateInfo.border ?? ''} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>Cancel</Button>
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
