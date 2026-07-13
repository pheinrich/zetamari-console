import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'
import { readContours } from '@/db/actions/contour'
import { computeContourThumbnail } from './contourThumbnail'
import ContoursListTable from './ContoursListTable'

export default async function ContoursPage()
{
  const contours = await readContours()
  const contourData = contours.map( c => ({...c, thumbnail: computeContourThumbnail( c )}) )

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ContoursListTable contourData={contourData} />
        </Grid>
      </Grid>
    </>
  )
}
