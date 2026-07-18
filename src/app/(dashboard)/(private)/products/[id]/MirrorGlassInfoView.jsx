import Link from 'next/link'
import Grid from '@mui/material/Grid2'
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

// Renamed from MirrorInfoView/'mirror' - see the
// 20260723000000-rename-product-types.js migration. `Contour` (see
// MirrorGlassInfo.js's contourId) is shown alongside the existing
// Shape/Width/Height fields rather than replacing them - it's an
// optional, additive reference for now (item 8's single-Contour
// redesign), not yet wired into any geometry/cost computation.
export default function MirrorGlassInfoView( {mirrorGlassInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Shape' value={mirrorGlassInfo.shape} />
      <Field label='Width' value={mirrorGlassInfo.width} />
      <Field label='Height' value={mirrorGlassInfo.height} />
      <Field label='Thickness' value={mirrorGlassInfo.thickness} />
      <Field label='Bevel' value={mirrorGlassInfo.bevel} />
      <Field
        label='Contour'
        value={mirrorGlassInfo.contourId ? <Link href={`/contours/${mirrorGlassInfo.contourId}`}>{mirrorGlassInfo.contourId}</Link> : null}
      />
    </Grid>
  )
}
