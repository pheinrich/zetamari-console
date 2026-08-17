import { addWeeks, startOfWeek } from 'date-fns'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import { readSchedulingInputs } from '@/db/actions/capacity'
import { formatDateOnly } from '@/libs/pieceScheduling'
import WeeklyBudgetGrid from './WeeklyBudgetGrid'
import CapacityOverridesEditor from './CapacityOverridesEditor'

const WEEKS_SHOWN = 8

export default async function CapacityPage()
{
  const {users, capacities, weeklyBudgets} = await readSchedulingInputs()

  const thisMonday = startOfWeek( new Date(), {weekStartsOn: 1} )
  const weekStarts = Array.from( {length: WEEKS_SHOWN}, (_, i) => formatDateOnly( addWeeks( thisMonday, i ) ) )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Capacity</Typography>
        <Typography color='text.secondary'>
          Weekly Budget is the standing hours/week each person is expected to work - the common case. Day-specific
          overrides below are for exceptions only; an unset week or day falls back automatically (see each
          User&apos;s Default Weekly Hours on their profile).
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <WeeklyBudgetGrid users={users} weeklyBudgets={weeklyBudgets} weekStarts={weekStarts} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <CapacityOverridesEditor users={users} capacities={capacities} />
      </Grid>
    </Grid>
  )
}
