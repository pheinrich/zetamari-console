import Grid from '@mui/material/Grid2'
import { readProducts } from '@/db/actions/product'
import { readSuppliers } from '@/db/actions/supplier'
import { readProductsCogsCosts } from '@/db/actions/productCost'
import ProductListTable from './ProductListTable'

// Stopgap: this page was hitting Vercel's default 10s function timeout
// (a hard cap unless raised) with a large/geometry-heavy catalog -
// readProductsCogsCosts() (productCost.js) rebuilds every wooden-base
// product's JTS geometry synchronously on every page view, and that CPU-
// bound cost grows with the catalog. Bought some headroom here while the
// new timing logs (below, and in productCost.js) pin down where the
// time is actually going and whether the real fix is caching the
// computed COGS total instead of live-recomputing it on every request.
// If this plan's actual cap is lower than 30s, Vercel will reject this
// at deploy/build time and say what the real ceiling is.
export const maxDuration = 30

export default async function ProductsPage()
{
  // Timed individually (not just the Promise.all as a whole) so a slow
  // page load can be traced to whichever of these three is the culprit -
  // see readProductsCogsCosts()'s own internal timing (productCost.js)
  // for why it's the prime suspect, but readProducts()/readSuppliers()
  // aren't free either as the catalog grows.
  const timed = async ( label, promise ) => {
    const start = Date.now()
    const result = await promise

    console.log( `ProductsPage: ${label} took ${Date.now() - start}ms` )

    return result
  }

  const pageStart = Date.now()

  const [products, suppliers, cogsCosts] = await Promise.all([
    timed( 'readProducts', readProducts() ),
    timed( 'readSuppliers', readSuppliers() ),
    timed( 'readProductsCogsCosts', readProductsCogsCosts() ),
  ])

  console.log( `ProductsPage: all data fetched in ${Date.now() - pageStart}ms` )

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
