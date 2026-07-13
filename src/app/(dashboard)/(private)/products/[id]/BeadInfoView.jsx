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

export default function BeadInfoView( {beadInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Category' value={beadInfo.category} />
      <Field label='Finish' value={beadInfo.finish} />
      <Field label='Shape' value={beadInfo.shape} />
      <Field label='Color' value={beadInfo.color} />
      <Field label='Length' value={beadInfo.length} />
      <Field label='Height' value={beadInfo.height} />
      <Field label='Thickness' value={beadInfo.thickness} />
    </Grid>
  )
}
