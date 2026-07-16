import Grid from '@mui/material/Grid2'

import { readSettings } from '@/db/actions/settings'
import SettingsForm from './SettingsForm'

export default async function SettingsPage()
{
  const settings = await readSettings()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SettingsForm initialData={settings} />
        </Grid>
      </Grid>
    </>
  )
}
