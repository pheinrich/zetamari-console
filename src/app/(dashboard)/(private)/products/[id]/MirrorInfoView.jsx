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

export default function MirrorInfoView( {mirrorInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Shape' value={mirrorInfo.shape} />
      <Field label='Width' value={mirrorInfo.width} />
      <Field label='Height' value={mirrorInfo.height} />
      <Field label='Thickness' value={mirrorInfo.thickness} />
      <Field label='Bevel' value={mirrorInfo.bevel} />
    </Grid>
  )
}
