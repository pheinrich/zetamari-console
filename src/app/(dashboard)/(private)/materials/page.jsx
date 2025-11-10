import Link from 'next/link'
import { deleteMaterial, readMaterials } from '@/db/actions/material'
import ActionButton from '@/components/ActionButton'
import RedirectButton from '@/components/RedirectButton'
import { ToastContainer } from 'react-toastify'

export default async function MaterialsPage()
{
  const materials = await readMaterials()

  async function serverAction( formData )
  {
    'use server'
    const id = formData.get( 'id' )
    deleteMaterial( id )
  }

  return (
    <div>
      <ToastContainer />
      <h1>Materials List</h1>
      <Link href='/materials/new'>+ New Material</Link>
      <ul>
        {materials.map( material => (
          <li key={material.id}>
            [{material.id}] <Link href={`/materials/${material.id}`}>{material.name}</Link> ({material.sku}): {material.type}
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
          </li>
        ))}
      </ul>
    </div>
  )
}
