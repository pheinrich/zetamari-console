'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setSupplierProductPrice, updateSupplierProductPrice, removeSupplierProductPrice } from '@/db/actions/supplier'

// A product can come from zero or more suppliers, each charging its own
// price. `suppliers` is the product's eager-loaded Supplier list (each with
// a `.SupplierProduct` join row attached by Sequelize); `supplierOptions`
// is every supplier available to add.
export default function SupplierProductView( {product, suppliers, supplierOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [supplierId, setSupplierId] = useState( '' )
  const [partNumber, setPartNumber] = useState( '' )
  const [cost, setCost] = useState( '' )
  const [error, setError] = useState( null )

  const usedIds = new Set( suppliers.map( (s) => s.id ) )
  const available = supplierOptions.filter( (s) => !usedIds.has( s.id ) )

  function handleAdd()
  {
    if( !supplierId )
      return

    setError( null )
    startTransition( async () => {
      const result = await setSupplierProductPrice( Number( supplierId ), product.id, partNumber, cost ? Number( cost ) : null )
      if( result?.error )
        setError( result.error )
      else
      {
        setSupplierId( '' )
        setPartNumber( '' )
        setCost( '' )
        router.refresh()
      }
    })
  }

  function handleUpdateCost( linkId, newCost )
  {
    startTransition( async () => {
      await updateSupplierProductPrice( linkId, {cost: newCost === '' ? null : Number( newCost )} )
      router.refresh()
    })
  }

  function handleRemove( linkId )
  {
    if( !confirm( "Remove this supplier's pricing for this product?" ) )
      return

    startTransition( async () => {
      await removeSupplierProductPrice( linkId )
      router.refresh()
    })
  }

  return (
    <div>
      <h2>Suppliers</h2>
      <table>
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Part #</th>
            <th>Cost / {product.units}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map( (supplier) => (
            <tr key={supplier.SupplierProduct.id}>
              <td><Link href={`/suppliers/${supplier.id}`}>{supplier.name}</Link></td>
              <td>{supplier.SupplierProduct.partNumber}</td>
              <td>
                <input
                  type='number'
                  step='0.00001'
                  min='0'
                  defaultValue={supplier.SupplierProduct.cost ?? ''}
                  onBlur={(e) => handleUpdateCost( supplier.SupplierProduct.id, e.target.value )}
                  disabled={isPending}
                />
              </td>
              <td>
                <button type='button' onClick={() => handleRemove( supplier.SupplierProduct.id )} disabled={isPending}>Remove</button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr><td colSpan={4}>Not linked to any suppliers yet.</td></tr>
          )}
        </tbody>
      </table>

      <div>
        <select value={supplierId} onChange={(e) => setSupplierId( e.target.value )}>
          <option value=''>Select a supplier...</option>
          {available.map( (s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input placeholder='Part #' value={partNumber} onChange={(e) => setPartNumber( e.target.value )} />
        <input
          type='number'
          step='0.00001'
          min='0'
          placeholder='Cost'
          value={cost}
          onChange={(e) => setCost( e.target.value )}
          style={{width: '6em'}}
        />
        <button type='button' onClick={handleAdd} disabled={isPending || !supplierId}>Add</button>
      </div>
      {error && <p>{error}</p>}
    </div>
  )
}
