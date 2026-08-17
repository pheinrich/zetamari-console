'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { upsertCapacity, deleteCapacity } from '@/db/actions/capacity'
import tableStyles from '@core/styles/table.module.css'

// Day-specific Capacity overrides - the exception case (a Grouting Day's
// extended Owner hours, a known day off, etc.), same "separate mini-CRUD"
// convention as products/BomEditor.jsx: each row action is its own
// server-action round-trip rather than one big form submit.
export default function CapacityOverridesEditor( {users, capacities} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState( '' )
  const [date, setDate] = useState( '' )
  const [hours, setHours] = useState( '' )

  const usersById = Object.fromEntries( users.map( u => [u.id, u] ) )

  function handleAdd()
  {
    if( !userId || !date || !hours )
      return

    startTransition( async () => {
      try
      {
        await upsertCapacity( Number( userId ), date, hours )
        setUserId( '' )
        setDate( '' )
        setHours( '' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to save the Capacity override' )
      }
    })
  }

  function handleUpdate( row, newHours )
  {
    startTransition( async () => {
      try
      {
        await upsertCapacity( row.userId, row.date, newHours )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to save the Capacity override' )
      }
    })
  }

  function handleRemove( row )
  {
    if( !confirm( `Remove this Capacity override for ${row.date}?` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteCapacity( row.id )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to remove the Capacity override' )
      }
    })
  }

  return (
    <Card>
      <CardHeader title='Capacity overrides (specific days)' />
      <CardContent className='flex flex-col gap-4'>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Person</th>
                <th>Date</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {capacities.map( row => (
                <tr key={row.id}>
                  <td>{usersById[row.userId]?.name || `User #${row.userId}`}</td>
                  <td>{row.date}</td>
                  <td>
                    <TextField
                      type='number'
                      size='small'
                      className='is-20'
                      inputProps={{step: '0.5', min: '0'}}
                      defaultValue={row.hours}
                      disabled={isPending}
                      onBlur={e => handleUpdate( row, e.target.value )}
                    />
                  </td>
                  <td>
                    <IconButton size='small' disabled={isPending} onClick={() => handleRemove( row )}>
                      <i className='ri-delete-bin-7-line' />
                    </IconButton>
                  </td>
                </tr>
              ) )}
              {0 === capacities.length && (
                <tr><td colSpan={4}>No day-specific overrides set.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='flex flex-wrap items-end gap-4'>
          <FormControl size='small' className='min-is-[200px]'>
            <InputLabel id='capacity-user-select'>Person</InputLabel>
            <Select
              labelId='capacity-user-select'
              label='Person'
              value={userId}
              onChange={e => setUserId( e.target.value )}
            >
              {users.map( u => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ) )}
            </Select>
          </FormControl>
          <TextField
            type='date'
            size='small'
            label='Date'
            value={date}
            onChange={e => setDate( e.target.value )}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type='number'
            size='small'
            label='Hours'
            inputProps={{step: '0.5', min: '0'}}
            value={hours}
            onChange={e => setHours( e.target.value )}
            className='is-24'
          />
          <Button variant='outlined' disabled={isPending || !userId || !date || !hours} onClick={handleAdd}>
            Add
          </Button>
        </div>
        {0 === users.length && (
          <Typography color='text.secondary' variant='body2'>No users found.</Typography>
        )}
      </CardContent>
    </Card>
  )
}
