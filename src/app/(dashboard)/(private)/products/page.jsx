import Grid from '@mui/material/Grid2'
import { readProducts } from '@/db/actions/product'
import { readSuppliers } from '@/db/actions/supplier'
import ProductListTable from './ProductListTable'

export default async function ProductsPage()
{
  const [products, suppliers] = await Promise.all([readProducts(), readSuppliers()])

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ProductListTable productData={products} supplierData={suppliers} />
        </Grid>
      </Grid>
    </>
  )
}
