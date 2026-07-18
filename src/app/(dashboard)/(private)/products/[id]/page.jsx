import Link from 'next/link'
import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { readProduct, readProducts } from '@/db/actions/product'
import { readSuppliers } from '@/db/actions/supplier'
import { readProductCosts } from '@/db/actions/productCost'
import CustomAvatar from '@core/components/mui/Avatar'
import classnames from 'classnames'

import ProductDetailActions from './ProductDetailActions'
import BeadInfoView from './BeadInfoView'
import BirdhouseBaseInfoView from './BirdhouseBaseInfoView'
import PictureFrameInfoView from './PictureFrameInfoView'
import MillefioriInfoView from './MillefioriInfoView'
import MirrorGlassInfoView from './MirrorGlassInfoView'
import WoodenBaseInfoView from './WoodenBaseInfoView'
import TileInfoView from './TileInfoView'
import ProductCostEditor from './ProductCostEditor'
import SupplierProductView from '../SupplierProductView'
import BomEditor from '../BomEditor'
import ProductImagesCard from '../ProductImagesCard'
import { productTypeMeta } from '../ProductTypeMeta'
import { formatCurrency } from '../productFormat'

export default async function ProductPage( {params} )
{
  const {id} = await params
  const product = await readProduct( id, true )

  if( !product )
    return notFound()

  const [allProducts, allSuppliers, costs] = await Promise.all([
    readProducts(),
    readSuppliers(),
    readProductCosts( product.id ),
  ])

  const meta = productTypeMeta( product.type )
  const primaryImage = product.images?.[0]

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.name}
                    width={64}
                    height={64}
                    className='rounded bg-actionHover object-cover'
                  />
                ) : (
                  <CustomAvatar skin='light' color={meta.color} size={64} variant='rounded'>
                    <i className={classnames( meta.icon, 'text-2xl' )} />
                  </CustomAvatar>
                )}
                <div className='flex flex-col gap-2'>
                  <Typography variant='h4'>{product.name}</Typography>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Typography color='text.secondary'>{product.sku}</Typography>
                    <Chip label={meta.label} size='small' variant='tonal' color={meta.color} />
                    <Chip
                      label={product.status === 'hidden' ? 'Hidden' : 'Visible'}
                      size='small'
                      variant='tonal'
                      color={product.status === 'hidden' ? 'default' : 'success'}
                    />
                    <Chip
                      label={product.sellable ? 'Sellable' : 'Material Only'}
                      size='small'
                      variant='tonal'
                      color={product.sellable ? 'primary' : 'secondary'}
                    />
                  </div>
                </div>
              </div>
              <ProductDetailActions product={product} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Details' />
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant='body2' color='text.secondary'>Units</Typography>
                      <Typography>{product.units || '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant='body2' color='text.secondary'>Weight</Typography>
                      <Typography>{product.weight ?? '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant='body2' color='text.secondary'>Shipping Weight</Typography>
                      <Typography>{product.shippingWeight ?? '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant='body2' color='text.secondary'>Wholesale Price</Typography>
                      <Typography>{formatCurrency( product.priceWholesale )}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant='body2' color='text.secondary'>Retail Price</Typography>
                      <Typography>{formatCurrency( product.priceRetail )}</Typography>
                    </Grid>
                    {product.description && (
                      <Grid size={{ xs: 12 }}>
                        <Divider className='mbe-4' />
                        <Typography variant='body2' color='text.secondary'>Description</Typography>
                        <Typography>{product.description}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Cost Breakdown' subheader='Per-factor production cost estimate - separate from the price fields above' />
                <CardContent>
                  <ProductCostEditor productId={product.id} costs={costs} />
                </CardContent>
              </Card>
            </Grid>

            {(product.beadInfo || product.birdhouseBaseInfo || product.pictureFrameInfo || product.millefioriInfo || product.mirrorGlassInfo || product.woodenBaseInfo || product.tileInfo) && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title={`${meta.label} Details`} />
                  <CardContent>
                    { product.beadInfo && <BeadInfoView beadInfo={product.beadInfo} /> }
                    { product.birdhouseBaseInfo && <BirdhouseBaseInfoView birdhouseBaseInfo={product.birdhouseBaseInfo} /> }
                    { product.pictureFrameInfo && <PictureFrameInfoView pictureFrameInfo={product.pictureFrameInfo} /> }
                    { product.millefioriInfo && <MillefioriInfoView millefioriInfo={product.millefioriInfo} /> }
                    { product.mirrorGlassInfo && <MirrorGlassInfoView mirrorGlassInfo={product.mirrorGlassInfo} /> }
                    { product.woodenBaseInfo && <WoodenBaseInfoView productId={product.id} woodenBaseInfo={product.woodenBaseInfo} /> }
                    { product.tileInfo && <TileInfoView tileInfo={product.tileInfo} /> }
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Bill of Materials' />
                <CardContent>
                  <BomEditor
                    productId={product.id}
                    bomLines={product.bomLines || []}
                    productOptions={allProducts.map( (p) => ({id: p.id, name: p.name, sku: p.sku, units: p.units}) )}
                  />
                </CardContent>
              </Card>
            </Grid>

            {product.usedInLines?.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='Used As a Material In' />
                  <CardContent>
                    <ul className='flex flex-col gap-2 pis-5'>
                      {product.usedInLines.map( (line) => (
                        <li key={line.id}>
                          <Link href={`/products/${line.parent.id}`}>{line.parent.name}</Link> (qty {line.quantity})
                        </li>
                      ) )}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <ProductImagesCard productId={product.id} images={product.images || []} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Supplier Pricing' />
                <CardContent>
                  <SupplierProductView
                    product={product}
                    suppliers={product.suppliers || []}
                    supplierOptions={allSuppliers.map( (s) => ({id: s.id, name: s.name}) )}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
