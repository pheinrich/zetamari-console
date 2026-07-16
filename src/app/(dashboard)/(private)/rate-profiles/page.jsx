import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'

import { readRateProfiles } from '@/db/actions/rateProfile'
import RateProfilesListTable from './RateProfilesListTable'

export default async function RateProfilesPage()
{
  const profiles = await readRateProfiles()

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <RateProfilesListTable profiles={profiles} />
        </Grid>
      </Grid>
    </>
  )
}
