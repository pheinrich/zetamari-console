import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import { readSchedulingInputs } from '@/db/actions/capacity'
import CapacityCalendar from './CapacityCalendar'

export default async function CapacityPage()
{
  const {users, capacityEvents, groutingDays} = await readSchedulingInputs()
  const owners = users.filter( u => 'owner' === u.role )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Capacity</Typography>
        <Typography color='text.secondary'>
          Capacity is entirely explicit - a day nobody&apos;s scheduled on an event is 0 hours. Click a day to
          create an event spanning one or more days (e.g. a normal production week, an away-at-a-show trip);
          assign any number of Owners/Assistants, each with their own per-day hours. Click an existing event&apos;s
          bar to edit it.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <CapacityCalendar owners={owners} capacityEvents={capacityEvents} groutingDays={groutingDays} />
      </Grid>
    </Grid>
  )
}
