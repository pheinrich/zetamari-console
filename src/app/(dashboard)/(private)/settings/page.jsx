import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'

import { readSettings } from '@/db/actions/settings'
import SettingsForm from './SettingsForm'

export default async function SettingsPage()
{
  const settings = await readSettings()

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SettingsForm initialData={settings} />
        </Grid>
      </Grid>
    </>
  )
}
