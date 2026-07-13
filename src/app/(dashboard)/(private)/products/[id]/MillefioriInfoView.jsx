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

export default function MillefioriInfoView( {millefioriInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Shape' value={millefioriInfo.shape} />
      <Field label='Color' value={millefioriInfo.color} />
      <Field label='Length' value={millefioriInfo.length} />
      <Field label='Width' value={millefioriInfo.width} />
      <Field label='Height' value={millefioriInfo.height} />
    </Grid>
  )
}
