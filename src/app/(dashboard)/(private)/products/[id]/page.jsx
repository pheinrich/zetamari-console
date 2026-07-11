import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteProduct, readProduct, readProducts } from '@/db/actions/product'
import { readSuppliers } from '@/db/actions/supplier'
import BeadInfoView from './BeadInfoView'
import FrameInfoView from './FrameInfoView'
import MillefioriInfoView from './MillefioriInfoView'
import MirrorInfoView from './MirrorInfoView'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'
import SubstrateInfoView from './SubstrateInfoView'
import SupplierProductView from '../SupplierProductView'
import BomEditor from '../BomEditor'
import TileInfoView from './TileInfoView'

export default async function ProductPage( {params} )
{
  const {id} = await params
  const product = await readProduct( id, true )

  if( !product )
    return notFound()

  const [allProducts, allSuppliers] = await Promise.all([
    readProducts(),
    readSuppliers(),
  ])

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteProduct( id )
  }

  return (
    <div>
      <h1>Product: {product.name}</h1>
      <RedirectButton targetUrl={`/products/${product.id}/edit`} label='Edit' />
      <ActionButton
        action={serverAction}
        id={product.id}
        label='Delete'
        labelPending='Deleting...'
        targetUrl='/products'
        confirmMsg='Are you sure you want to delete the product? This is blocked if it is still used as a material in another product.'
        successMsg='Product sucessfully deleted'
        failMsg='Failed to delete the product'
      />

      <div>SKU: {product.sku}</div>
      <div>Type: {product.type || '(none - finished/assembled product)'}</div>
      <div>Sellable: {product.sellable ? 'Yes' : 'No'}</div>
      <div>Units: {product.units}</div>
      <div>Weight: {product.weight}</div>
      <div>Wholesale Price: {product.priceWholesale}</div>
      <div>Retail Price: {product.priceRetail}</div>
      <div>Description: {product.description}</div>
      { product.beadInfo && <BeadInfoView beadInfo={product.beadInfo} /> }
      { product.frameInfo && <FrameInfoView frameInfo={product.frameInfo} /> }
      { product.millefioriInfo && <MillefioriInfoView millefioriInfo={product.millefioriInfo} /> }
      { product.mirrorInfo && <MirrorInfoView mirrorInfo={product.mirrorInfo} /> }
      { product.substrateInfo && <SubstrateInfoView substrateInfo={product.substrateInfo} /> }
      { product.tileInfo && <TileInfoView tileInfo={product.tileInfo} /> }

      <BomEditor
        productId={product.id}
        bomLines={product.bomLines || []}
        productOptions={allProducts.map( (p) => ({id: p.id, name: p.name, sku: p.sku, units: p.units}) )}
      />

      { product.usedInLines?.length > 0 && (
        <div>
          <h2>Used As a Material In</h2>
          <ul>
            {product.usedInLines.map( (line) => (
              <li key={line.id}>
                <Link href={`/products/${line.parent.id}`}>{line.parent.name}</Link> (qty {line.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}

      <SupplierProductView
        product={product}
        suppliers={product.suppliers || []}
        supplierOptions={allSuppliers.map( (s) => ({id: s.id, name: s.name}) )}
      />

      <hr />
      <Link href='/products'>All Products</Link>
    </div>
  )
}
