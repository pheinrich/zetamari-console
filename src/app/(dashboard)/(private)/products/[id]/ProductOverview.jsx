import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { INFO_KEY, infoSchemas } from '@/libs/productInfo'
import BeadInfoView from './BeadInfoView'
import BirdhouseBaseInfoView from './BirdhouseBaseInfoView'
import MillefioriInfoView from './MillefioriInfoView'
import MirrorGlassInfoView from './MirrorGlassInfoView'
import PictureFrameInfoView from './PictureFrameInfoView'
import ProductInfoSection from './ProductInfoSection'
import TileInfoView from './TileInfoView'
import WoodenBaseInfoView from './WoodenBaseInfoView'
import UsedInSummary from './UsedInSummary'

// The type-specific *Info view for a product, or null if it has none.
function typeInfoView( product )
{
  if( product.beadInfo ) return <BeadInfoView beadInfo={product.beadInfo} />
  if( product.birdhouseBaseInfo ) return <BirdhouseBaseInfoView birdhouseBaseInfo={product.birdhouseBaseInfo} />
  if( product.pictureFrameInfo ) return <PictureFrameInfoView pictureFrameInfo={product.pictureFrameInfo} />
  if( product.millefioriInfo ) return <MillefioriInfoView millefioriInfo={product.millefioriInfo} />
  if( product.mirrorGlassInfo ) return <MirrorGlassInfoView mirrorGlassInfo={product.mirrorGlassInfo} />
  if( product.woodenBaseInfo ) return <WoodenBaseInfoView productId={product.id} woodenBaseInfo={product.woodenBaseInfo} />
  if( product.tileInfo ) return <TileInfoView tileInfo={product.tileInfo} />

  return null
}

// Just the editable fields of the product's Info row (no ids, timestamps
// or included contours), for the details popup's starting values.
function editableInfo( product )
{
  const key = INFO_KEY[product.type]
  const info = product[key]

  if( !info )
    return null

  return Object.fromEntries( Object.keys( infoSchemas[key].shape ).map( (field) => [field, info[field] ?? null] ) )
}

export default function ProductOverview( {product, usedInCount, contourList} )
{
  const hasInfoType = Boolean( INFO_KEY[product.type] )

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h5'>{product.name}</Typography>
          <Typography color='text.secondary'>{product.sku}</Typography>
        </div>

        {hasInfoType && (
          <ProductInfoSection
            product={{id: product.id, name: product.name, type: product.type}}
            info={editableInfo( product )}
            contourList={contourList}
          >
            {typeInfoView( product )}
          </ProductInfoSection>
        )}

        <div>
          <Typography variant='h6'>Used as a Material</Typography>
          <Divider className='mlb-4' />
          <UsedInSummary product={{id: product.id, name: product.name}} count={usedInCount} />
        </div>
      </CardContent>
    </Card>
  )
}
