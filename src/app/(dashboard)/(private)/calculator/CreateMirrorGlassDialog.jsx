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
import { MIRROR_GLASS_SHAPE_VALUES, resolveMirrorGlassShape } from './mirrorGlassShape'

const schema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  type: z.literal( 'mirror glass' ),
  mirrorGlassInfo: z.object({
    contourId: z.coerce.number().int(),
    shape: z.enum( MIRROR_GLASS_SHAPE_VALUES ),
    width: z.coerce.number(),
    height: z.coerce.number(),
    thickness: z.coerce.number(),
    bevel: z.coerce.number(),
  }),
})

// Counterpart to CreateWoodenBaseDialog.jsx - the other shape-derived Bill
// of Materials category CreateNewProductDialog.jsx's picker can fork
// fresh from the Visualizer's current shape when no existing Mirror Glass
// product already fits. Takes `outsideContour` directly (rather than a
// full `contours` list + substrateInfo.outsideId lookup, as the old
// standalone "Save New Mirror Glass..." dialog did) since the caller has
// already resolved it. Thickness/bevel aren't tracked in the working
// panel at all, so they're set to MirrorGlassInfo's own usual defaults
// (0.125"/0) rather than prompted for here - edit them afterward on the
// product's own edit page if they need to differ.
export default function CreateMirrorGlassDialog( {open, onClose, substrateInfo, outsideContour, onCreated} )
{
  const [name, setName] = useState( '' )
  const [sku, setSku] = useState( '' )
  const createdRef = useRef( null )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: async data => {
      const result = await createProduct( data )

      if( result?.success )
        createdRef.current = {id: result.id, name: data.name, sku: data.sku, type: 'mirror glass'}

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

  const shape = resolveMirrorGlassShape( outsideContour )

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{component: 'form', onSubmit: handleSubmit}}>
      <DialogTitle>Create New Mirror Glass</DialogTitle>
      <DialogContent>
        <DialogContentText className='mbe-4'>
          This creates a new Mirror Glass Product in your inventory using the shape and dimensions currently shown
          in the Visualizer (Thickness defaults to 0.125&quot; and Bevel to 0 - edit those afterward if needed), and
          selects it as this line&rsquo;s material.
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

        <input type='hidden' name='type' value='mirror glass' />
        <input type='hidden' name='mirrorGlassInfo.contourId' value={substrateInfo?.outsideId ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.shape' value={shape} />
        <input type='hidden' name='mirrorGlassInfo.width' value={substrateInfo?.width ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.height' value={substrateInfo?.height ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.thickness' value='0.125' />
        <input type='hidden' name='mirrorGlassInfo.bevel' value='0' />
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
