import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import { readSchedulingInputs } from '@/db/actions/capacity'
import CapacityCalendar from './CapacityCalendar'

export default async function CapacityPage()
{
  const {users, capacities, weeklyBudgets, assistantAvailability, groutingDays} = await readSchedulingInputs()
  const owners = users.filter( u => 'owner' === u.role )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Capacity</Typography>
        <Typography color='text.secondary'>
          Each Owner&apos;s hours default from their Weekly Budget/Default Weekly Hours (shown muted) - type a
          number to override a specific day (including 0, for a day off), or clear it to go back to the default.
          Named assistants can be added per day; their hours feed the shared assistant labor pool for scheduling,
          including Grouting Day&apos;s expected turnout.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <CapacityCalendar
          owners={owners}
          capacities={capacities}
          weeklyBudgets={weeklyBudgets}
          assistantAvailability={assistantAvailability}
          groutingDays={groutingDays}
        />
      </Grid>
    </Grid>
  )
}
