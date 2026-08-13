import Grid from '@mui/material/Grid2'
import { readLiveClasses } from '@/db/actions/liveClass'
import LiveClassesListTable from './LiveClassesListTable'

export default async function LiveClassesPage()
{
  const liveClasses = await readLiveClasses()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <LiveClassesListTable liveClassData={liveClasses} />
        </Grid>
      </Grid>
    </>
  )
}
