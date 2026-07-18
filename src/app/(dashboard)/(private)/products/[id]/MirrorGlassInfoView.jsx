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
// 20260723000000-rename-product-types.js migration.
export default function MirrorGlassInfoView( {mirrorGlassInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Shape' value={mirrorGlassInfo.shape} />
      <Field label='Width' value={mirrorGlassInfo.width} />
      <Field label='Height' value={mirrorGlassInfo.height} />
      <Field label='Thickness' value={mirrorGlassInfo.thickness} />
      <Field label='Bevel' value={mirrorGlassInfo.bevel} />
    </Grid>
  )
}
