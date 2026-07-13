import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'
import { readSuppliers } from '@/db/actions/supplier'
import SuppliersListTable from './SuppliersListTable'

export default async function SuppliersPage()
{
  const suppliers = await readSuppliers()

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <SuppliersListTable supplierData={suppliers} />
        </Grid>
      </Grid>
    </>
  )
}
