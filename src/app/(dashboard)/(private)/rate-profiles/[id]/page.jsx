import { notFound } from 'next/navigation'
import Grid from '@mui/material/Grid2'

import { readRateProfile } from '@/db/actions/rateProfile'
import RateProfileEditor from './RateProfileEditor'

export default async function RateProfilePage( {params} )
{
  const {id} = await params
  const profile = await readRateProfile( id )

  if( !profile )
    return notFound()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <RateProfileEditor profile={profile} />
        </Grid>
      </Grid>
    </>
  )
}
