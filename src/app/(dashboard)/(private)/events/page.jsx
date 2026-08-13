import Grid from '@mui/material/Grid2'
import { readEvents } from '@/db/actions/event'
import EventsListTable from './EventsListTable'

export default async function EventsPage()
{
  const events = await readEvents()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <EventsListTable eventData={events} />
        </Grid>
      </Grid>
    </>
  )
}
