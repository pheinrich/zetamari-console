'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { deleteRateProfile } from '@/db/actions/rateProfile'
import tableStyles from '@core/styles/table.module.css'

const KIND_LABELS = {wholesale: 'Wholesale', retail: 'Retail', cogs: 'COGS', custom: 'Custom'}
const KIND_COLORS = {wholesale: 'primary', retail: 'primary', cogs: 'warning', custom: 'secondary'}

// Simple, unpaginated table - unlike Products/Contours/Suppliers/Users,
// the number of rate profiles is expected to stay small (the two system
// defaults plus however many custom ones are actually useful to have),
// so the sorting/pagination/persistence machinery those lists use
// (useTableViewState + react-table) would be overkill here.
export default function RateProfilesListTable( {profiles} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete( profile )
  {
    if( !confirm( `Delete the "${profile.name}" rate profile?` ) )
      return

    startTransition( async () => {
      const result = await deleteRateProfile( profile.id )
      if( result?.error )
        toast.error( result.error )
      else
      {
        toast.success( 'Rate profile deleted' )
        router.refresh()
      }
    })
  }

  return (
    <Card>
      <CardHeader title='Rate Profiles' className='pbe-4' />
      <Divider />
      <div className='flex justify-end p-5'>
        <Button variant='contained' component={Link} href='/rate-profiles/new' startIcon={<i className='ri-add-line' />}>
          New Profile
        </Button>
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Kind</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map( profile => (
              <tr key={profile.id}>
                <td>
                  <Typography component={Link} href={`/rate-profiles/${profile.id}`} className='font-medium' color='text.primary'>
                    {profile.name}
                  </Typography>
                </td>
                <td>
                  <Chip
                    label={KIND_LABELS[profile.kind] || profile.kind}
                    variant='tonal'
                    color={KIND_COLORS[profile.kind] || 'secondary'}
                    size='small'
                  />
                </td>
                <td>
                  <div className='flex items-center'>
                    <IconButton size='small' component={Link} href={`/rate-profiles/${profile.id}`}>
                      <i className='ri-edit-box-line text-[22px] text-textSecondary' />
                    </IconButton>
                    {'custom' === profile.kind && (
                      <IconButton size='small' disabled={isPending} onClick={() => handleDelete( profile )}>
                        <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
                      </IconButton>
                    )}
                  </div>
                </td>
              </tr>
            ) )}
            {0 === profiles.length && (
              <tr><td colSpan={3}>No rate profiles found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
