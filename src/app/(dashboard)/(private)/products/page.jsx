import Grid from '@mui/material/Grid2'
import { readProducts } from '@/db/actions/product'
import { readSuppliers } from '@/db/actions/supplier'
import { readProductsCogsCosts } from '@/db/actions/productCost'
import ProductListTable from './ProductListTable'

export default async function ProductsPage()
{
  const [products, suppliers, cogsCosts] = await Promise.all([
    readProducts(),
    readSuppliers(),
    readProductsCogsCosts(),
  ])

  // Merged in here rather than inside readProducts() itself - that keeps
  // the plain product list cheap for callers that don't need cost data,
  // and readProductsCogsCosts() batches its own queries regardless of
  // product count (see productCost.js), so there's no per-product cost
  // penalty to worry about either way.
  const productsWithCogs = products.map( p => ({...p, cogsCost: cogsCosts[p.id] ?? 0}) )

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ProductListTable productData={productsWithCogs} supplierData={suppliers} />
        </Grid>
      </Grid>
    </>
  )
}
