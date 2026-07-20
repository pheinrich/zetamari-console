'use client'

import Link from 'next/link'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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
  return (
    <Grid container spacing={4}>
      <Field label='Outside Contour' value={<Link href={`/contours/${woodenBaseInfo.outsideId}`}>{woodenBaseInfo.outsideId}</Link>} />
      <Field label='Inside Contour' value={woodenBaseInfo.insideId ? <Link href={`/contours/${woodenBaseInfo.insideId}`}>{woodenBaseInfo.insideId}</Link> : null} />
      <Field label='Rabbet Contour' value={woodenBaseInfo.rabbetId ? <Link href={`/contours/${woodenBaseInfo.rabbetId}`}>{woodenBaseInfo.rabbetId}</Link> : null} />
      <Field label='Dimensions' value={`${woodenBaseInfo.width}" x ${woodenBaseInfo.height}"`} />
      <Field label='Thickness' value={`${woodenBaseInfo.thickness}"`} />
      <Field label='Border' value={woodenBaseInfo.border} />
      <Grid size={{ xs: 12 }}>
        <Button
          variant='outlined'
          component={Link}
          href={`/calculator?productId=${productId}`}
          startIcon={<i className='ri-ruler-2-line' />}
        >
          Open in Visualizer
        </Button>
      </Grid>
    </Grid>
  )
}
