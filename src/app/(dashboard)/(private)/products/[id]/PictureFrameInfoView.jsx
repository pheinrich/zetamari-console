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
// contour fields here - just dimensions. Renamed from FrameInfoView/
// 'frame' - see the 20260723000000-rename-product-types.js migration.
export default function PictureFrameInfoView( {pictureFrameInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Width' value={pictureFrameInfo.width} />
      <Field label='Height' value={pictureFrameInfo.height} />
      <Field label='Thickness' value={pictureFrameInfo.thickness} />
      <Field label='Channel' value={pictureFrameInfo.channel} />
      <Field label='Border' value={pictureFrameInfo.border} />
      <Field label='Photo Width' value={pictureFrameInfo.photoWidth} />
      <Field label='Photo Height' value={pictureFrameInfo.photoHeight} />
    </Grid>
  )
}
