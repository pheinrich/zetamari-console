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

// MirrorGlassInfo.shape's parametric ENUM (see the model) - matches the
// same key-bearing ShapeType.key values Contour.shape can carry (see the
// 20260715000000-shape-types.js migration). A custom (svgData-only)
// outside contour has no matching ENUM value, so it falls back to
// 'other' here - the ENUM is legacy/descriptive only at this point (see
// MirrorGlassInfo.js's comment on `contourId`), so 'other' losing that
// detail isn't a real loss; `contourId` still carries the real shape.
const MIRROR_GLASS_SHAPE_KEYS = new Set( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis'] )

const schema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  type: z.literal( 'mirror glass' ),
  mirrorGlassInfo: z.object({
    contourId: z.coerce.number().int(),
    shape: z.enum( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis', 'other'] ),
    width: z.coerce.number(),
    height: z.coerce.number(),
    thickness: z.coerce.number(),
    bevel: z.coerce.number(),
  }),
})

// Counterpart to SaveNewWoodenBaseDialog.jsx - the other product type the
// Visualizer can fork the working panel's current shape into. Since the
// working panel only ever tracks one contour + width/height/border (no
// separate mirror-glass-specific state), this maps `substrateInfo.
// outsideId` onto MirrorGlassInfo.contourId (see the
// 20260724000000-mirror-glass-contour.js migration) and reads
// width/height straight across; `shape` is set too, for continuity with
// the older ENUM-based display (MirrorGlassInfoView.jsx), whenever the
// outside contour's shape family matches one of its values. Thickness/
// bevel aren't tracked in the working panel at all, so they're set to
// MirrorGlassInfo's own usual defaults (0.125"/0) rather than prompted
// for here - edit them afterward on the product's own edit page if they
// need to differ.
export default function SaveNewMirrorGlassDialog( {open, onClose, substrateInfo, contours} )
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

  const outsideContour = contours.find( c => c.id === substrateInfo.outsideId )
  const shapeKey = outsideContour?.shape?.key
  const shape = MIRROR_GLASS_SHAPE_KEYS.has( shapeKey ) ? shapeKey : 'other'

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{component: 'form', onSubmit: handleSubmit}}>
      <DialogTitle>Save New Mirror Glass</DialogTitle>
      <DialogContent>
        <DialogContentText className='mbe-4'>
          This creates a new Mirror Glass Product in your inventory using the shape and dimensions currently shown
          in the Visualizer (Thickness defaults to 0.125&quot; and Bevel to 0 - edit those afterward if needed). This
          can&rsquo;t be undone automatically - you&rsquo;ll be able to edit or delete the product afterward from the
          Products list.
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

        <input type='hidden' name='type' value='mirror glass' />
        <input type='hidden' name='mirrorGlassInfo.contourId' value={substrateInfo.outsideId ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.shape' value={shape} />
        <input type='hidden' name='mirrorGlassInfo.width' value={substrateInfo.width ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.height' value={substrateInfo.height ?? ''} />
        <input type='hidden' name='mirrorGlassInfo.thickness' value='0.125' />
        <input type='hidden' name='mirrorGlassInfo.bevel' value='0' />
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
