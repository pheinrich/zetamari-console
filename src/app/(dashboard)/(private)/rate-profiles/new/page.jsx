import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'

import RateProfileForm from '../RateProfileForm'

export default function NewRateProfilePage()
{
  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <RateProfileForm />
        </Grid>
      </Grid>
    </>
  )
}
