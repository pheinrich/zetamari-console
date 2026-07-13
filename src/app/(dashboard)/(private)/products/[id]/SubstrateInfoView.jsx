import Link from 'next/link'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { build } from '@/libs/mirror'

function Field( {label, value} )
{
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <Typography variant='body2' color='text.secondary'>{label}</Typography>
      <Typography>{value ?? '—'}</Typography>
    </Grid>
  )
}

export default function SubstrateInfoView( {substrateInfo} )
{
  // Computed for a future rendered preview of the assembled shape; not
  // displayed yet, kept as-is from before this restyle.
  const mirror = build(
    substrateInfo.width,
    substrateInfo.height,
    substrateInfo.border,
    substrateInfo.outsideId,
    substrateInfo.outside.svgData,
    substrateInfo.inside?.svgData,
    substrateInfo.rabbet?.svgData,
  )

  return (
    <Grid container spacing={4}>
      <Field label='Outside Contour' value={<Link href={`/contours/${substrateInfo.outsideId}`}>{substrateInfo.outsideId}</Link>} />
      <Field label='Inside Contour' value={substrateInfo.insideId ? <Link href={`/contours/${substrateInfo.insideId}`}>{substrateInfo.insideId}</Link> : null} />
      <Field label='Rabbet Contour' value={substrateInfo.rabbetId ? <Link href={`/contours/${substrateInfo.rabbetId}`}>{substrateInfo.rabbetId}</Link> : null} />
      <Field label='Dimensions' value={`${substrateInfo.width}" x ${substrateInfo.height}"`} />
      <Field label='Thickness' value={`${substrateInfo.thickness}"`} />
      <Field label='Border' value={substrateInfo.border} />
    </Grid>
  )
}
