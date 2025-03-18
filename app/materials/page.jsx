import Link from 'next/link'
import { readMaterials } from '@/db/actions/material'

export default async function MaterialsPage()
{
  const materials = await readMaterials()

  return (
    <div>
      <h1>Materials List</h1>
      <ul>
        {materials.map( material => (
          <li key={material.id}>
            [{material.id}] <Link href={`/materials/${material.id}`}>{material.name}</Link> ({material.sku}): {material.type}
          </li>
        ))}
      </ul>
    </div>
  )
}
