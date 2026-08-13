import Grid from '@mui/material/Grid2'
import { readCustomers } from '@/db/actions/customer'
import CustomersListTable from './CustomersListTable'

export default async function CustomersPage()
{
  const customers = await readCustomers()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomersListTable customerData={customers} />
        </Grid>
      </Grid>
    </>
  )
}
