'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { setSupplierProductPrice, updateSupplierProductPrice, removeSupplierProductPrice } from '@/db/actions/supplier'
import tableStyles from '@core/styles/table.module.css'

// A product can come from zero or more suppliers, each charging its own
// price. `suppliers` is the product's eager-loaded Supplier list (each with
// a `.SupplierProduct` join row attached by Sequelize); `supplierOptions`
// is every supplier available to add. Rendered inside a Card by the
// caller, which supplies the "Supplier Pricing" title.
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
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
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
                  <TextField
                    type='number'
                    size='small'
                    inputProps={{step: '0.00001', min: '0'}}
                    defaultValue={supplier.SupplierProduct.cost ?? ''}
                    onBlur={(e) => handleUpdateCost( supplier.SupplierProduct.id, e.target.value )}
                    disabled={isPending}
                    className='is-24'
                  />
                </td>
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( supplier.SupplierProduct.id )}>
                    <i className='ri-delete-bin-7-line' />
                  </IconButton>
                </td>
              </tr>
            ) )}
            {suppliers.length === 0 && (
              <tr><td colSpan={4}>Not linked to any suppliers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <FormControl size='small' className='min-is-[180px]'>
          <InputLabel id='supplier-select'>Add a supplier</InputLabel>
          <Select
            labelId='supplier-select'
            label='Add a supplier'
            value={supplierId}
            onChange={(e) => setSupplierId( e.target.value )}
          >
            {available.map( (s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ) )}
          </Select>
        </FormControl>
        <TextField
          size='small'
          label='Part #'
          value={partNumber}
          onChange={(e) => setPartNumber( e.target.value )}
        />
        <TextField
          type='number'
          size='small'
          label='Cost'
          inputProps={{step: '0.00001', min: '0'}}
          value={cost}
          onChange={(e) => setCost( e.target.value )}
          className='is-24'
        />
        <Button variant='outlined' disabled={isPending || !supplierId} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
    </div>
  )
}
