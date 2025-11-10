import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteMaterial, readMaterial } from '@/db/actions/material'
import { build } from '@/lib/mirror'
import BeadInfoView from './BeadInfoView'
import FrameInfoView from './FrameInfoView'
import MillefioriInfoView from './MillefioriInfoView'
import MirrorInfoView from './MirrorInfoView'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'
import Material from '@/db/models/Material'
import SubstrateInfoView from './SubstrateInfoView'
import SupplierMaterial from '@/db/models/SupplierMaterial'
import SupplierMaterialView from '../SupplierMaterialView'
import TileInfoView from './TileInfoView'

export default async function MaterialPage( {params} )
{
  const {id} = await params
  const material = await readMaterial( id, true )

  if( !material )
    return notFound()

  const beadInfo = await material.beadInfo
  const frameInfo = await material.frameInfo
  const millefioriInfo = await material.millefioriInfo
  const mirrorInfo = await material.mirrorInfo
  const substrateInfo = await material.substrateInfo
  const tileInfo = await material.tileInfo
  const suppliers = await material.suppliers

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteMaterial( id )
  }

  return (
    <div>
      <h1>Material: {material.name}</h1>
      <RedirectButton targetUrl={`/materials/${material.id}/edit`} label='Edit' />
      <ActionButton
        action={serverAction}
        id={material.id}
        label='Delete'
        labelPending='Deleting...'
        targetUrl='/materials'
        confirmMsg='Are you sure you want to delete the material?'
        successMsg='Material sucessfully deleted'
        failMsg='Failed to delete the material'
      />

      <div>Type: {material.type}</div>
      <div>SKU: {material.sku}</div>
      <div>Units: {material.units}</div>
      <div>Weight: {material.weight}</div>
      <div>Description: {material.description}</div>
      { beadInfo && <BeadInfoView beadInfo={beadInfo} /> }
      { frameInfo && <FrameInfoView frameInfo={frameInfo} /> }
      { millefioriInfo && <MillefioriInfoView millefioriInfo={millefioriInfo} /> }
      { mirrorInfo && <MirrorInfoView mirrorInfo={mirrorInfo} /> }
      { substrateInfo && <SubstrateInfoView substrateInfo={substrateInfo} /> }
      { tileInfo && <TileInfoView tileInfo={tileInfo} /> }
      { suppliers && <SupplierMaterialView material={material} suppliers={suppliers} /> }
      <hr />
      <Link href='/materials'>All Materials</Link>
    </div>
  )
}
