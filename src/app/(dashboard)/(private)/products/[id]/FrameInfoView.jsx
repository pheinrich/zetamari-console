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

// Frames are always rectangular (per Angie), so intentionally no shape or
// contour fields here - just dimensions.
export default function FrameInfoView( {frameInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Width' value={frameInfo.width} />
      <Field label='Height' value={frameInfo.height} />
      <Field label='Thickness' value={frameInfo.thickness} />
      <Field label='Channel' value={frameInfo.channel} />
      <Field label='Border' value={frameInfo.border} />
      <Field label='Photo Width' value={frameInfo.photoWidth} />
      <Field label='Photo Height' value={frameInfo.photoHeight} />
    </Grid>
  )
}
