'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { setSupplierProductPrice, updateSupplierProductPrice, removeSupplierProductPrice } from '@/db/actions/supplier'
import tableStyles from '@core/styles/table.module.css'
import { useConfirm } from '@/contexts/confirmContext'
import { dollarInputProps } from '@/utils/units'

const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

// Only http(s) links get an open button - anything else typed into the
// URL field is kept but not made clickable.
function safeHref( url )
{
  const trimmed = (url ?? '').trim()

  if( !trimmed )
    return null

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test( trimmed ) ? trimmed : `https://${trimmed}`

  return /^https?:\/\//i.test( withScheme ) ? withScheme : null
}

// Every typed word, in any order, somewhere in the supplier's name.
function filterSuppliers( options, state )
{
  const typed = state.inputValue.trim().toLowerCase().split( /\s+/ ).filter( Boolean )

  return options.filter( o => typed.every( w => o.name.toLowerCase().includes( w ) ) )
}

function numberOrNull( value )
{
  return '' === value || null == value ? null : Number( value )
}

// A product can come from zero or more suppliers, each charging its own
// price. `suppliers` is the product's eager-loaded Supplier list (each with
// a `.SupplierProduct` join row - id, partNumber, url, cost - attached by
// Sequelize); `supplierOptions` is every supplier available to add;
// `usedInLines` are the BOM lines consuming this product, so each supplier
// can show how many of them have pinned it (see BomEditor's supplier
// picker - unpinned lines use the cheapest price, flagged here). Rendered
// inside a Card by the caller, which supplies the title.
export default function SupplierProductView( {product, suppliers, supplierOptions, usedInLines = []} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()
  const [newSupplier, setNewSupplier] = useState( null )
  const [partNumber, setPartNumber] = useState( '' )
  const [cost, setCost] = useState( '' )
  const [url, setUrl] = useState( '' )
  const [error, setError] = useState( null )

  const usedIds = new Set( suppliers.map( (s) => s.id ) )

  // Cheapest first, unpriced last.
  const rows = [...suppliers].sort( (a, b) =>
    (a.SupplierProduct.cost ?? Infinity) - (b.SupplierProduct.cost ?? Infinity) || a.name.localeCompare( b.name ) )

  const priced = rows.filter( (s) => null != s.SupplierProduct.cost )
  const cheapestId = priced.length > 1 ? priced[0].id : null

  const pinnedCount = {}
  for( const line of usedInLines )
    if( line.supplierId )
      pinnedCount[line.supplierId] = (pinnedCount[line.supplierId] ?? 0) + 1

  function save( linkId, updates )
  {
    setError( null )
    startTransition( async () => {
      const result = await updateSupplierProductPrice( linkId, updates )
      if( result?.error )
        setError( result.error )

      router.refresh()
    })
  }

  // Inline fields save on blur, and only when the value actually changed.
  function handleBlur( link, field, raw )
  {
    const value = 'cost' === field ? numberOrNull( raw ) : raw.trim()

    if( value !== (link[field] ?? ('cost' === field ? null : '')) )
      save( link.id, {[field]: value} )
  }

  function handleAdd()
  {
    if( !newSupplier )
      return

    setError( null )
    startTransition( async () => {
      const result = await setSupplierProductPrice( newSupplier.id, product.id, partNumber.trim(), numberOrNull( cost ), url.trim() || null )
      if( result?.error )
        setError( result.error )
      else
      {
        setNewSupplier( null )
        setPartNumber( '' )
        setCost( '' )
        setUrl( '' )
        router.refresh()
      }
    })
  }

  async function handleRemove( supplier )
  {
    const pinned = pinnedCount[supplier.id] ?? 0
    const message = pinned
      ? `Remove ${supplier.name} from this product? ${pinned} bill-of-materials line${1 === pinned ? '' : 's'} pinned to this supplier will switch to the cheapest remaining price.`
      : `Remove ${supplier.name} from this product?`

    if( !await confirm( message, {confirmText: 'Remove', destructive: true} ) )
      return

    startTransition( async () => {
      await removeSupplierProductPrice( supplier.SupplierProduct.id )
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
              <th>Cost</th>
              <th>Product page</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map( (supplier) => {
              const link = supplier.SupplierProduct
              const href = safeHref( link.url )
              const pinned = pinnedCount[supplier.id] ?? 0

              return (
                <tr key={link.id}>
                  <td>
                    <div className='flex flex-col items-start gap-1'>
                      <Link href={`/suppliers/${supplier.id}`}>{supplier.name}</Link>
                      <div className='flex flex-wrap gap-1'>
                        {supplier.id === cheapestId && <Chip size='small' variant='tonal' color='success' label='Cheapest' />}
                        {pinned > 0 && (
                          <Tooltip title='Bill-of-materials lines that use this supplier instead of the cheapest'>
                            <Chip size='small' variant='tonal' color='info' label={`Pinned by ${pinned}`} />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <TextField
                      size='small'
                      defaultValue={link.partNumber ?? ''}
                      onBlur={(e) => handleBlur( link, 'partNumber', e.target.value )}
                      disabled={isPending}
                      className='is-36'
                    />
                  </td>
                  <td>
                    <TextField
                      type='number'
                      size='small'
                      inputProps={{step: '0.00001', min: '0'}}
                      defaultValue={link.cost ?? ''}
                      placeholder='—'
                      onBlur={(e) => handleBlur( link, 'cost', e.target.value )}
                      disabled={isPending}
                      InputProps={dollarInputProps( product.units || 'each' )}
                      sx={noSpinnerSx}
                      className='is-44'
                    />
                  </td>
                  <td>
                    <div className='flex items-center gap-1'>
                      <TextField
                        size='small'
                        defaultValue={link.url ?? ''}
                        placeholder='https://'
                        onBlur={(e) => handleBlur( link, 'url', e.target.value )}
                        disabled={isPending}
                        className='min-is-[200px]'
                      />
                      {href && (
                        <Tooltip title='Open supplier page'>
                          <IconButton size='small' component='a' href={href} target='_blank' rel='noopener noreferrer'>
                            <i className='ri-external-link-line' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                  <td>
                    <IconButton size='small' disabled={isPending} onClick={() => handleRemove( supplier )}>
                      <i className='ri-delete-bin-7-line' />
                    </IconButton>
                  </td>
                </tr>
              )
            } )}
            {0 === rows.length && (
              <tr><td colSpan={5}>Not linked to any suppliers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <Autocomplete
          size='small'
          options={supplierOptions}
          value={newSupplier}
          onChange={(e, value) => setNewSupplier( value )}
          filterOptions={filterSuppliers}
          getOptionLabel={(s) => s.name}
          getOptionDisabled={(s) => usedIds.has( s.id )}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={({key, ...props}, s) => (
            <li key={key} {...props}>
              <div className='flex flex-col'>
                <span>{s.name}</span>
                {usedIds.has( s.id ) && <small className='text-textSecondary'>already listed</small>}
              </div>
            </li>
          )}
          renderInput={(params) => <TextField {...params} label='Add a supplier' placeholder='Search suppliers' />}
          sx={{minInlineSize: 240, flex: 1, maxInlineSize: 360}}
        />
        <TextField
          size='small'
          label='Part #'
          value={partNumber}
          onChange={(e) => setPartNumber( e.target.value )}
          className='is-36'
        />
        <TextField
          type='number'
          size='small'
          label='Cost'
          inputProps={{step: '0.00001', min: '0'}}
          value={cost}
          onChange={(e) => setCost( e.target.value )}
          InputProps={dollarInputProps( product.units || 'each' )}
          sx={noSpinnerSx}
          className='is-44'
        />
        <TextField
          size='small'
          label='Product page'
          placeholder='https://'
          value={url}
          onChange={(e) => setUrl( e.target.value )}
          className='min-is-[200px]'
        />
        <Button variant='outlined' disabled={isPending || !newSupplier} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {0 === supplierOptions.length && (
        <Typography variant='body2' color='text.secondary'>
          No suppliers yet - <Link href='/suppliers/new'>add one</Link> first.
        </Typography>
      )}
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
    </div>
  )
}
