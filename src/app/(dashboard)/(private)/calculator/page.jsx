import { readContours } from '@/db/actions/contour'
import { readProduct, readSubstrateProducts } from '@/db/actions/product'

import MirrorCalculator from './MirrorCalculator'

// Two entry points share this page: /calculator (blank/default shape,
// "visualize new options") and /calculator?productId=N (prepopulated from
// an existing substrate Product, e.g. linked from that product's detail
// page). Neither path edits the tied product in place - the calculator is
// exploratory local state; the only persistence action is "Save as New
// Product", which forks the current values into a brand new Product.
export default async function CalculatorPage( {searchParams} )
{
  const params = await searchParams
  const productId = params?.productId ? Number( params.productId ) : undefined

  const [contours, substrateProducts] = await Promise.all([
    readContours(),
    readSubstrateProducts(),
  ])

  let initialProduct = null

  if( productId )
  {
    const product = await readProduct( productId, true )
    if( product?.type === 'substrate' )
      initialProduct = product
  }

  return (
    <MirrorCalculator
      initialProduct={initialProduct}
      contours={contours}
      substrateProducts={substrateProducts}
    />
  )
}
