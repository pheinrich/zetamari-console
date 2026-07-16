import Grid from '@mui/material/Grid2'
import { readSuppliers } from '@/db/actions/supplier'
import SuppliersListTable from './SuppliersListTable'

export default async function SuppliersPage()
{
  const suppliers = await readSuppliers()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SuppliersListTable supplierData={suppliers} />
        </Grid>
      </Grid>
    </>
  )
}
