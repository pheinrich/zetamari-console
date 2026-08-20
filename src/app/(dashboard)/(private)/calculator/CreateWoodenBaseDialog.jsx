'use client'

import { useEffect, useRef, useState } from 'react'

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

// Nested "no suitable existing Wooden Base" fallback for
// CreateNewProductDialog.jsx's picker - forks the Visualizer's current
// shape/dimensions/contours into a brand new Wooden Base Product, same as
// the old standalone "Save New Wooden Base..." kebab item used to (see its
// removal from MirrorCalculator.jsx), but reports the new product back via
// `onCreated` instead of navigating away, so the parent dialog can select
// it as this line's material and keep going rather than losing its other
// in-progress picks. Name/SKU are controlled (rather than the old dialog's
// plain uncontrolled TextFields) purely so `onCreated` has their values on
// hand without a follow-up fetch - createProduct only ever resolves
// {success, id}, not the full row.
export default function CreateWoodenBaseDialog( {open, onClose, substrateInfo, onCreated} )
{
  const [name, setName] = useState( '' )
  const [sku, setSku] = useState( '' )
  const createdRef = useRef( null )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: async data => {
      const result = await createProduct( data )

      if( result?.success )
        createdRef.current = {id: result.id, name: data.name, sku: data.sku, type: 'wooden base'}

      return result
    },
  })

  useEffect( () => {
    if( !success )
      return

    onCreated( createdRef.current )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success] )

  useEffect( () => {
    if( !open )
      return

    setName( '' )
    setSku( '' )
  }, [open] )

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{component: 'form', onSubmit: handleSubmit}}>
      <DialogTitle>Create New Wooden Base</DialogTitle>
      <DialogContent>
        <DialogContentText className='mbe-4'>
          This creates a new Wooden Base Product in your inventory using the shape, dimensions, and contours
          currently shown in the Visualizer, and selects it as this line&rsquo;s material. You&rsquo;ll be able to edit
          or delete it afterward from the Products list.
        </DialogContentText>

        {errors && (
          <Alert severity='error' className='mbe-4'>
            <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
          </Alert>
        )}

        <Stack spacing={4}>
          <TextField fullWidth autoFocus label='Name' name='name' value={name} onChange={evt => setName( evt.target.value )} required />
          <TextField fullWidth label='SKU' name='sku' value={sku} onChange={evt => setSku( evt.target.value )} required />
        </Stack>

        <input type='hidden' name='type' value='wooden base' />
        <input type='hidden' name='woodenBaseInfo.outsideId' value={substrateInfo?.outsideId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.insideId' value={substrateInfo?.insideId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.rabbetId' value={substrateInfo?.rabbetId ?? ''} />
        <input type='hidden' name='woodenBaseInfo.width' value={substrateInfo?.width ?? ''} />
        <input type='hidden' name='woodenBaseInfo.height' value={substrateInfo?.height ?? ''} />
        <input type='hidden' name='woodenBaseInfo.border' value={substrateInfo?.border ?? ''} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>Cancel</Button>
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
