import Link from 'next/link'
import { deleteMaterial, readMaterials } from '@/db/actions/material'
import DeleteButton from './DeleteButton'
import { ToastContainer } from 'react-toastify'

export default async function MaterialsPage()
{
  const materials = await readMaterials()

  return (
    <div>
      <ToastContainer />
      <h1>Materials List</h1>
      <Link href='/materials/new'>+ New Material</Link>
      <ul>
        {materials.map( material => (
          <li key={material.id}>
            [{material.id}] <Link href={`/materials/${material.id}`}>{material.name}</Link> ({material.sku}): {material.type}
            <DeleteButton id={material.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
