import Link from 'next/link'
import MaterialForm from '../../MaterialForm'
import { notFound } from 'next/navigation'
import { readContours } from '@/db/actions/contour'
import { readMaterial, updateMaterial } from '@/db/actions/material'
import SupplierMaterial from '@/db/models/SupplierMaterial'

export default async function EditMaterialPage( {params} )
{
  const {id} = await params
  const material = await readMaterial( id, true )
  if( !material )
    return notFound()

  const contours = await readContours()

  return (
    <>
      <MaterialForm
        onSubmit={updateMaterial}
        contourList={contours.map( (c) => ({id: c.id, name: c.name}) )}
        initialData={material}
      />
      <hr />
      <Link href={`/materials/${id}`}>Cancel</Link><br/>
      <Link href='/materials'>All Materials</Link>
    </>
  )
}