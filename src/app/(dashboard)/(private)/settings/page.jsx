import Grid from '@mui/material/Grid2'

import { readSettings, readCostFactors } from '@/db/actions/settings'
import SettingsForm from './SettingsForm'

export default async function SettingsPage()
{
  const [settings, costFactors] = await Promise.all([readSettings(), readCostFactors()])

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SettingsForm initialData={settings} costFactors={costFactors} />
        </Grid>
      </Grid>
    </>
  )
}
