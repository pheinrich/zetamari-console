import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import { readContours } from '@/db/actions/contour'
import { readProduct } from '@/db/actions/product'

import ProductHero from './ProductHero'
import ProductTabs from './ProductTabs'
import ProductOverview from './ProductOverview'

export default async function ProductPage( {params} )
{
  const {id} = await params
  const product = await readProduct( id, true )

  if( !product )
    return notFound()

  // Only the contour-based types' details popups need the contour list.
  const contourList = ['mirror glass', 'wooden base'].includes( product.type )
    ? (await readContours()).map( (c) => ({id: c.id, name: c.name}) )
    : []

  // Just what the hero pane shows, as a plain object for the client.
  const primaryImage = product.images?.[0]
  const summary = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    type: product.type,
    status: product.status,
    sellable: product.sellable,
    description: product.description,
    primaryImage: primaryImage ? {url: primaryImage.url, altText: primaryImage.altText} : null,
    usedInCount: new Set( (product.usedInLines ?? []).map( (line) => line.parentProductId ) ).size,
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <ProductHero product={summary} />
      </Grid>
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <ProductTabs
          tabContent={{
            overview: <ProductOverview product={product} usedInCount={summary.usedInCount} contourList={contourList} />,
          }}
        />
      </Grid>
    </Grid>
  )
}
