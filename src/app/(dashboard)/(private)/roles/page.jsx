import Grid from '@mui/material/Grid2'
import { readRoles } from '@/db/actions/role'
import RolesListTable from './RolesListTable'

export default async function RolesPage()
{
  const roles = await readRoles()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <RolesListTable roleData={roles} />
      </Grid>
    </Grid>
  )
}
