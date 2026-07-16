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

import { addBomLine, updateBomLine, removeBomLine, setBomLineSupplier } from '@/db/actions/product'
import { resolveSupplierCost } from '@/libs/costFactors'
import { formatCurrency } from './productFormat'
import tableStyles from '@core/styles/table.module.css'

const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

// Manages a product's bill of materials: the other Products it's assembled
// from, and how many of each. `bomLines` are the current lines (each with
// its `material` product eager-loaded, including `material.suppliers` with
// their per-supplier cost, plus the line's own chosen `supplier`/
// `supplierId`); `productOptions` is every product this one could add as a
// material (excluding itself). Rendered inside a Card by the caller, which
// supplies the "Bill of Materials" title.
//
// Each line's cost (quantity x its supplier's price) feeds the "Bill of
// Materials" cost factor in the per-product cost breakdown (see
// libs/costFactors.js's resolveSupplierCost, reused here so the total
// shown below always matches what that breakdown computes) - shown here
// mainly so a supplier can be picked/compared before saving.
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

  function handleUpdateSupplier( lineId, supplierId )
  {
    startTransition( async () => {
      await setBomLineSupplier( lineId, supplierId || null )
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

  const total = bomLines.reduce(
    (sum, line) => sum + (line.quantity || 0) * resolveSupplierCost( line.material, line.supplierId ),
    0
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bomLines.map( (line) => {
              const suppliers = line.material.suppliers || []
              const unitCost = resolveSupplierCost( line.material, line.supplierId )
              const lineCost = (line.quantity || 0) * unitCost

              return (
                <tr key={line.id}>
                  <td>
                    <Link href={`/products/${line.material.id}`}>{line.material.name}</Link>
                    <Typography variant='body2' color='text.secondary'>{line.material.sku}</Typography>
                  </td>
                  <td>
                    <div className='flex items-center gap-2'>
                      <TextField
                        type='number'
                        size='small'
                        inputProps={{step: '0.0001', min: '0'}}
                        defaultValue={line.quantity}
                        onBlur={(e) => handleUpdateQuantity( line.id, e.target.value )}
                        disabled={isPending}
                        sx={noSpinnerSx}
                        className='is-24'
                      />
                      <Typography variant='body2'>{line.material.units}</Typography>
                    </div>
                  </td>
                  <td>
                    {0 === suppliers.length && (
                      <Typography variant='body2' color='text.secondary'>no supplier priced</Typography>
                    )}
                    {1 === suppliers.length && (
                      <Typography variant='body2'>{suppliers[0].name}</Typography>
                    )}
                    {suppliers.length > 1 && (
                      <FormControl size='small' className='min-is-[160px]'>
                        <Select
                          displayEmpty
                          value={line.supplierId || ''}
                          onChange={(e) => handleUpdateSupplier( line.id, e.target.value || null )}
                          disabled={isPending}
                        >
                          <MenuItem value=''>Cheapest (auto)</MenuItem>
                          {suppliers.map( (s) => (
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                          ) )}
                        </Select>
                      </FormControl>
                    )}
                  </td>
                  <td>{formatCurrency( lineCost )}</td>
                  <td>
                    <IconButton size='small' disabled={isPending} onClick={() => handleRemove( line.id )}>
                      <i className='ri-delete-bin-7-line' />
                    </IconButton>
                  </td>
                </tr>
              )
            } )}
            {bomLines.length === 0 && (
              <tr><td colSpan={5}>No materials added yet.</td></tr>
            )}
            {bomLines.length > 0 && (
              <tr>
                <td colSpan={3}><Typography variant='body2' className='font-medium'>Total</Typography></td>
                <td><Typography variant='body2' className='font-medium'>{formatCurrency( total )}</Typography></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <FormControl size='small' className='min-is-[220px]'>
          <InputLabel id='bom-material-select'>Add a material</InputLabel>
          <Select
            labelId='bom-material-select'
            label='Add a material'
            value={materialProductId}
            onChange={(e) => setMaterialProductId( e.target.value )}
          >
            {available.map( (p) => (
              <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>
            ) )}
          </Select>
        </FormControl>
        <TextField
          type='number'
          size='small'
          label='Quantity'
          inputProps={{step: '0.0001', min: '0'}}
          value={quantity}
          onChange={(e) => setQuantity( e.target.value )}
          sx={noSpinnerSx}
          className='is-24'
        />
        <Button variant='outlined' disabled={isPending || !materialProductId} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
    </div>
  )
}
