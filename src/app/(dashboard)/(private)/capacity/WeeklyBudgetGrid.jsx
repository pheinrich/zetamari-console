'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { upsertWeeklyBudget } from '@/db/actions/capacity'
import tableStyles from '@core/styles/table.module.css'

const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

function weekLabel( weekStart )
{
  const [, month, day] = weekStart.split( '-' )
  return `${month}/${day}`
}

// Rows = Users, columns = the next few Mondays (WEEKS_SHOWN, from the
// parent page) - the common-case input surface for Capacity (Weekly
// Budget is the standing default; day-specific overrides are the
// exception, handled by the sibling CapacityOverridesEditor below).
// Blank means unset, falling back to the User's own defaultWeeklyHours
// (see CONTEXT.md's Weekly Budget entry) - not replicated here, kept
// simple.
export default function WeeklyBudgetGrid( {users, weeklyBudgets, weekStarts} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const hoursByKey = Object.fromEntries( weeklyBudgets.map( w => [`${w.userId}:${w.weekStartDate}`, w.hours] ) )

  function handleChange( userId, weekStart, value )
  {
    startTransition( async () => {
      try
      {
        await upsertWeeklyBudget( userId, weekStart, value )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to save Weekly Budget' )
      }
    })
  }

  return (
    <Card>
      <CardHeader title='Weekly Budget (hours/week)' />
      <CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Person</th>
                {weekStarts.map( weekStart => <th key={weekStart}>{weekLabel( weekStart )}</th> )}
              </tr>
            </thead>
            <tbody>
              {users.map( user => (
                <tr key={user.id}>
                  <td>
                    <Typography className='font-medium'>{user.name}</Typography>
                    <Typography variant='body2' color='text.secondary' className='capitalize'>
                      {user.role || 'unspecified'}{null != user.defaultWeeklyHours ? ` · default ${user.defaultWeeklyHours}h` : ''}
                    </Typography>
                  </td>
                  {weekStarts.map( weekStart => (
                    <td key={weekStart}>
                      <TextField
                        type='number'
                        size='small'
                        className='is-20'
                        sx={noSpinnerSx}
                        inputProps={{step: '0.5', min: '0'}}
                        defaultValue={hoursByKey[`${user.id}:${weekStart}`] ?? ''}
                        disabled={isPending}
                        onBlur={e => handleChange( user.id, weekStart, e.target.value )}
                      />
                    </td>
                  ) )}
                </tr>
              ) )}
              {0 === users.length && (
                <tr><td colSpan={weekStarts.length + 1}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
