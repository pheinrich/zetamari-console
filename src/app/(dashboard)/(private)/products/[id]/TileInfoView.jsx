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

export default function TileInfoView( {tileInfo} )
{
  return (
    <Grid container spacing={4}>
      <Field label='Color' value={tileInfo.color} />
      <Field label='Width' value={tileInfo.width && `${tileInfo.width} mm`} />
      <Field label='Height' value={tileInfo.height && `${tileInfo.height} mm`} />
      <Field label='Thickness' value={tileInfo.thickness && `${tileInfo.thickness} mm`} />
    </Grid>
  )
}
