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

// BirdhouseBase's first-ever detail view - 'birdhouse'/'birdhouse base'
// previously had no type-specific Info at all (see
// BirdhouseBaseInfo.js). A box, not a traced outline, so - like
// PictureFrameInfoView - just dimensions, no shape/contour fields.
export default function BirdhouseBaseInfoView( {birdhouseBaseInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Width' value={birdhouseBaseInfo.width} />
      <Field label='Height' value={birdhouseBaseInfo.height} />
      <Field label='Depth' value={birdhouseBaseInfo.depth} />
    </Grid>
  )
}
