'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { setShapeTypePrototype } from '@/db/actions/shapeType'

function Field( {label, value} )
{
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <Typography variant='body2' color='text.secondary'>{label}</Typography>
      <Typography>{value ?? '—'}</Typography>
    </Grid>
  )
}

// Renamed from SubstrateInfoView/'substrate' - see the
// 20260723000000-rename-product-types.js migration. Also drops a dead
// `build()` call this used to make on every render ("computed for a
// future rendered preview... not displayed yet") - besides being unused,
// build() now throws for a custom shape whose outside Contour is missing
// svgData (see mirror.js), so keeping an unused call around was a latent
// crash risk for no benefit.
export default function WoodenBaseInfoView( {productId, woodenBaseInfo} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Only key-bearing (basic/parametric) shape families ever show up in
  // the Visualizer's "New" dropdown (see NewShapeMenu.jsx), so only
  // those are offered a prototype button here - see ShapeType.js's
  // prototypeWoodenBase association and the
  // 20260727000000-shape-type-prototype.js migration.
  const shape = woodenBaseInfo.outside?.shape
  const isPrototype = shape && shape.prototypeWoodenBaseId === productId

  function handleSetPrototype()
  {
    startTransition( async () => {
      await setShapeTypePrototype( shape.id, productId )
      toast.success( `Set as the prototype for ${shape.name}` )
      router.refresh()
    })
  }

  function handleClearPrototype()
  {
    startTransition( async () => {
      await setShapeTypePrototype( shape.id, null )
      toast.success( `Cleared the prototype for ${shape.name}` )
      router.refresh()
    })
  }

  return (
    <Grid container spacing={4}>
      <Field label='Outside Contour' value={<Link href={`/contours/${woodenBaseInfo.outsideId}`}>{woodenBaseInfo.outsideId}</Link>} />
      <Field label='Inside Contour' value={woodenBaseInfo.insideId ? <Link href={`/contours/${woodenBaseInfo.insideId}`}>{woodenBaseInfo.insideId}</Link> : null} />
      <Field label='Rabbet Contour' value={woodenBaseInfo.rabbetId ? <Link href={`/contours/${woodenBaseInfo.rabbetId}`}>{woodenBaseInfo.rabbetId}</Link> : null} />
      <Field label='Dimensions' value={`${woodenBaseInfo.width}" x ${woodenBaseInfo.height}"`} />
      <Field label='Thickness' value={`${woodenBaseInfo.thickness}"`} />
      <Field label='Border' value={woodenBaseInfo.border} />
      <Field
        label='Pieces Per Sheet'
        value={woodenBaseInfo.piecesPerSheet > 0 ? woodenBaseInfo.piecesPerSheet : 'Computed automatically'}
      />
      <Grid size={{ xs: 12 }}>
        <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap'>
          <Button
            variant='outlined'
            component={Link}
            href={`/calculator?productId=${productId}`}
            startIcon={<i className='ri-ruler-2-line' />}
          >
            Open in Visualizer
          </Button>
          {shape?.key && (
            <Button
              variant={isPrototype ? 'contained' : 'outlined'}
              color={isPrototype ? 'success' : 'primary'}
              disabled={isPending}
              onClick={isPrototype ? handleClearPrototype : handleSetPrototype}
              startIcon={<i className={isPrototype ? 'ri-star-fill' : 'ri-star-line'} />}
            >
              {isPrototype ? `Prototype for ${shape.name}` : `Set as Prototype for ${shape.name}`}
            </Button>
          )}
        </Stack>
        {isPrototype && (
          <Typography variant='caption' color='text.secondary' display='block' className='mbs-2'>
            New shapes of this family, picked from the Visualizer&rsquo;s New menu, start from this product&rsquo;s
            dimensions and border.
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}
