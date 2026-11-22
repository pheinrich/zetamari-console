import { notFound } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'

import { readContours } from '@/db/actions/contour'
import { readBomMaterialChoices, readProduct } from '@/db/actions/product'

import { readProductImages } from '@/db/actions/productImage'
import { readSuppliers } from '@/db/actions/supplier'

import BomEditor from '../BomEditor'
import SupplierProductView from '../SupplierProductView'
import ProductImagesTab from './ProductImagesTab'

import ProductHero from './ProductHero'
import ProductTabs from './ProductTabs'
import ProductOverview from './ProductOverview'

export default async function ProductPage( {params} )
{
  const {id} = await params
  const [product, materialChoices, images, allSuppliers] = await Promise.all( [
    readProduct( id, true ),
    readBomMaterialChoices( id ),
    readProductImages( id ),
    readSuppliers(),
  ] )

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
            bom: (
              <Card>
                <CardHeader title='Bill of Materials' subheader='The products this one is made from, and how much of each goes into one.' />
                <CardContent>
                  <BomEditor productId={product.id} bomLines={product.bomLines ?? []} productOptions={materialChoices} />
                </CardContent>
              </Card>
            ),
            images: <ProductImagesTab productId={product.id} images={images} />,
            suppliers: (
              <Card>
                <CardHeader title='Suppliers' subheader='Where this product is bought, and what each supplier charges. Bills of materials use the starred (preferred) supplier, else the cheapest, unless a line picks its own.' />
                <CardContent>
                  <SupplierProductView
                    product={{id: product.id, units: product.units}}
                    suppliers={product.suppliers ?? []}
                    supplierOptions={allSuppliers.map( (s) => ({id: s.id, name: s.name}) ).sort( (a, b) => a.name.localeCompare( b.name ) )}
                    usedInLines={product.usedInLines ?? []}
                  />
                </CardContent>
              </Card>
            ),
          }}
        />
      </Grid>
    </Grid>
  )
}
