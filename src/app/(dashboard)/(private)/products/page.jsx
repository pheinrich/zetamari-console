import Grid from '@mui/material/Grid2'
import { ToastContainer } from 'react-toastify'
import { readProducts } from '@/db/actions/product'
import ProductListTable from './ProductListTable'

export default async function ProductsPage()
{
  const products = await readProducts()

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ProductListTable productData={products} />
        </Grid>
      </Grid>
    </>
  )
}
