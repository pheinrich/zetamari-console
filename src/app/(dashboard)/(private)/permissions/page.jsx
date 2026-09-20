import Grid from '@mui/material/Grid2'
import { readPermissions } from '@/db/actions/permission'
import PermissionsListTable from './PermissionsListTable'

export default async function PermissionsPage()
{
  const permissions = await readPermissions()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PermissionsListTable permissionData={permissions} />
      </Grid>
    </Grid>
  )
}
