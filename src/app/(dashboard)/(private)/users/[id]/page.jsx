import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { readUser } from '@/db/actions/user'
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
  const user = await readUser( id )

  if( !user )
    return notFound()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64}>
                  {initials( user.name )}
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{user.name}</Typography>
                  <Typography color='text.secondary'>{user.email}</Typography>
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
