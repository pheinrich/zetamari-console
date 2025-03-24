import { notFound } from 'next/navigation'
import { readMaterial } from '@/db/actions/material'
import { build } from '@/lib/mirror'
import BeadInfoView from './BeadInfoView'
import SubstrateInfoView from './SubstrateInfoView'
import TileInfoView from './TileInfoView'

export default async function MaterialPage( {params} )
{
  const {id} = await params
  const material = await readMaterial( id, true )

  if( !material )
    return notFound()

  const beadInfo = await material.getBeadInfo()
  const frameInfo = await material.getFrameInfo()
  const millefioriInfo = await material.getMillefioriInfo()
  const mirrorInfo = await material.getMirrorInfo()
  const substrateInfo = await material.getSubstrateInfo()
  const tileInfo = await material.getTileInfo()

  return (
    <div>
      <h1>Material: {material.name}</h1>
      <div>Type: {material.type}</div>
      <div>SKU: {material.sku}</div>
      <div>Units: {material.units}</div>
      <div>Weight: {material.weight}</div>
      <div>Description: {material.description}</div>
      { beadInfo && <BeadInfoView beadInfo={beadInfo} /> }
      { substrateInfo && <SubstrateInfoView substrateInfo={substrateInfo} /> }
      { tileInfo && <TileInfoView tileInfo={tileInfo} /> }
    </div>
  )
}
