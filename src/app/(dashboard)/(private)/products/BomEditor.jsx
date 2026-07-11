'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addBomLine, updateBomLine, removeBomLine } from '@/db/actions/product'

// Manages a product's bill of materials: the other Products it's assembled
// from, and how many of each. `bomLines` are the current lines (each with
// its `material` product eager-loaded); `productOptions` is every product
// this one could add as a material (excluding itself).
export default function BomEditor( {productId, bomLines, productOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [materialProductId, setMaterialProductId] = useState( '' )
  const [quantity, setQuantity] = useState( '1' )
  const [error, setError] = useState( null )

  const usedIds = new Set( bomLines.map( (l) => l.materialProductId ) )
  const available = productOptions.filter( (p) => p.id !== productId && !usedIds.has( p.id ) )

  function handleAdd()
  {
    if( !materialProductId )
      return

    setError( null )
    startTransition( async () => {
      const result = await addBomLine( productId, Number( materialProductId ), Number( quantity ) )
      if( result?.error )
        setError( result.error )
      else
      {
        setMaterialProductId( '' )
        setQuantity( '1' )
        router.refresh()
      }
    })
  }

  function handleUpdateQuantity( lineId, newQuantity )
  {
    startTransition( async () => {
      await updateBomLine( lineId, Number( newQuantity ) )
      router.refresh()
    })
  }

  function handleRemove( lineId )
  {
    if( !confirm( 'Remove this material from the bill of materials?' ) )
      return

    startTransition( async () => {
      await removeBomLine( lineId )
      router.refresh()
    })
  }

  return (
    <div>
      <h2>Bill of Materials</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bomLines.map( (line) => (
            <tr key={line.id}>
              <td>
                <Link href={`/products/${line.material.id}`}>{line.material.name}</Link> ({line.material.sku})
              </td>
              <td>
                <input
                  type='number'
                  step='0.0001'
                  min='0'
                  defaultValue={line.quantity}
                  onBlur={(e) => handleUpdateQuantity( line.id, e.target.value )}
                  disabled={isPending}
                />
                {' '}{line.material.units}
              </td>
              <td>
                <button type='button' onClick={() => handleRemove( line.id )} disabled={isPending}>Remove</button>
              </td>
            </tr>
          ))}
          {bomLines.length === 0 && (
            <tr><td colSpan={3}>No materials added yet.</td></tr>
          )}
        </tbody>
      </table>

      <div>
        <select value={materialProductId} onChange={(e) => setMaterialProductId( e.target.value )}>
          <option value=''>Select a product/material...</option>
          {available.map( (p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        <input
          type='number'
          step='0.0001'
          min='0'
          value={quantity}
          onChange={(e) => setQuantity( e.target.value )}
          style={{width: '5em'}}
        />
        <button type='button' onClick={handleAdd} disabled={isPending || !materialProductId}>Add</button>
      </div>
      {error && <p>{error}</p>}
    </div>
  )
}
