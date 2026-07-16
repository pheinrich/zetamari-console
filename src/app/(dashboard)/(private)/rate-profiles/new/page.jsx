import Grid from '@mui/material/Grid2'

import RateProfileForm from '../RateProfileForm'

export default function NewRateProfilePage()
{
  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <RateProfileForm />
        </Grid>
      </Grid>
    </>
  )
}
