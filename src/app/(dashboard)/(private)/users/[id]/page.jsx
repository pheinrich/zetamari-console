import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readUser } from '@/db/actions/person'
import { customerDisplayName } from '../../customers/customerFormat'
import CustomAvatar from '@core/components/mui/Avatar'
import UserDetailActions from './UserDetailActions'

function initials( name )
{
  return (name || '')
    .split( ' ' )
    .filter( Boolean )
    .slice( 0, 2 )
    .map( part => part[0].toUpperCase() )
    .join( '' )
}

export default async function UserPage( {params} )
{
  const {id} = await params
  const user = await readUser( id, true )

  if( !user )
    return notFound()

  const name = customerDisplayName( user )

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64}>
                  {initials( name )}
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{name}</Typography>
                  <Typography color='text.secondary'>{user.email}</Typography>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {(user.Roles || []).map( r => <Chip key={r.id} label={r.name} size='small' variant='tonal' /> )}
                  </div>
                </div>
              </div>
              <UserDetailActions user={user} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
