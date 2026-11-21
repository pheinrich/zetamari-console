'use client'

import { useMemo, useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { matchChannelOrderLine } from '@/db/actions/channelOrder'
import { suggestProducts } from '@/libs/channelOrders/suggest'
import NewProductDialog from './NewProductDialog'

// Always offered last, whatever's typed: nothing in the catalog fits.
const CREATE = {id: 'create', create: true, sku: '', name: 'Create a new product…'}

// Empty box: just the suggestions. Typing: every Product whose SKU or
// name contains each typed word, in any order ("lace 10"), first 50.
// Either way, "Create a new product…" comes last.
function filterOptions( options, state )
{
  const typed = state.inputValue.trim().toLowerCase().split( /\s+/ ).filter( Boolean )

  if( !typed.length )
    return [...options.filter( o => o.suggested ), CREATE]

  return [...options.filter( o => !o.suggested && typed.every( w => `${o.sku} ${o.name}`.toLowerCase().includes( w ) ) ).slice( 0, 50 ), CREATE]
}

const label = p => p.create ? p.name : `${p.sku} - ${p.name}`
const group = o => o.create ? 'Not listed' : o.suggested ? 'Suggested' : 'All products'

// The Product cell of a Channel Order Line: its match (a link), or
// "unmatched" - and, while the order is under review, a picker to match
// it by hand. The picker opens on suggestions ranked for this line (see
// suggest.js); typing searches every Product by SKU and name. When the
// line's SKU isn't the chosen Product's own, "remember" (on by default)
// keeps the SKU as a Product Alias, matching it on future orders and on
// every other open line now. "Create a new product…" makes one from the
// line (NewProductDialog) and matches it.
export default function LineProductPicker( {line, products, editable} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState( false )
  const [choice, setChoice] = useState( null )
  const [remember, setRemember] = useState( true )
  const [typed, setTyped] = useState( '' )
  const [creating, setCreating] = useState( false )
  const [listOpen, setListOpen] = useState( false )

  // Suggestions first (grouped), then everything else - recomputed only while open
  const options = useMemo( () => {
    if( !editing )
      return []

    const suggested = suggestProducts( line, products ).map( s => ({...s.product, suggested: true}) )

    return [...suggested, ...products]
  }, [editing, line, products] )

  const skuDiffers = line.sku && choice && choice.sku.trim().toLowerCase() !== line.sku.trim().toLowerCase()

  function save( productId )
  {
    startTransition( () => match( productId, Boolean( productId && skuDiffers && remember ) ) )
  }

  // The new Product takes the line's SKU unless it was changed - then the
  // line's SKU is remembered as an alias for it, as when picking one.
  async function created( productId, sku )
  {
    setCreating( false )
    await match( productId, Boolean( line.sku && sku.toLowerCase() !== line.sku.trim().toLowerCase() ) )
  }

  async function match( productId, rememberAlias )
  {
    const result = await matchChannelOrderLine( line.id, productId, {remember: rememberAlias} )

    if( result.error )
      return toast.error( result.error )

    if( result.alsoMatched )
      toast.success( `Matched - and ${result.alsoMatched} other line${result.alsoMatched === 1 ? '' : 's'} with SKU ${line.sku}` )
    else
      toast.success( productId ? 'Matched' : 'Unmatched' )

    setEditing( false )
    setChoice( null )
    router.refresh()
  }

  if( !editing )
    return (
      <div className='flex items-center gap-1'>
        {line.Product
          ? <Link href={`/products/${line.Product.id}`}>{line.Product.name}</Link>
          : <Chip size='small' variant='tonal' color='warning' label='unmatched' />}
        {editable && (
          <Tooltip title={line.Product ? 'Change match' : 'Match to a product'}>
            <IconButton size='small' onClick={() => setEditing( true )}>
              <i className={line.Product ? 'ri-pencil-line' : 'ri-links-line'} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    )

  return (
    <div className='flex flex-col gap-1' style={{minInlineSize: 340}}>
      <Autocomplete
        size='small'
        options={options}
        value={choice}
        open={listOpen && !creating}
        onOpen={() => setListOpen( true )}
        onClose={() => setListOpen( false )}
        onChange={(e, value) => value?.create ? setCreating( true ) : setChoice( value )}
        onInputChange={(e, value, reason) => reason === 'input' && setTyped( value )}
        filterOptions={filterOptions}
        groupBy={group}
        getOptionLabel={label}
        getOptionKey={o => o.create ? 'create' : `${o.suggested ? 's' : 'a'}${o.id}`}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        renderOption={({key, ...props}, o) => o.create ? (
          <li key={key} {...props}>
            <span className='flex items-center gap-2 text-primary'><i className='ri-add-line' />{o.name}</span>
          </li>
        ) : (
          <li key={key} {...props}>
            <div className='flex flex-col'>
              <span>{o.name}{o.status === 'hidden' && <Chip size='small' variant='tonal' label='hidden' className='mis-2' />}</span>
              <small className='text-textSecondary'>{o.sku}</small>
            </div>
          </li>
        )}
        openOnFocus
        renderInput={params => <TextField {...params} autoFocus placeholder='Search SKU or name' />}
      />
      {skuDiffers && (
        <FormControlLabel
          control={<Checkbox size='small' checked={remember} onChange={e => setRemember( e.target.checked )} />}
          label={<small>Remember {line.sku} as {choice.sku}</small>}
        />
      )}
      <div className='flex gap-2'>
        <Button size='small' variant='contained' disabled={!choice || isPending} onClick={() => save( choice.id )}>Match</Button>
        {line.Product && <Button size='small' color='warning' disabled={isPending} onClick={() => save( null )}>Unmatch</Button>}
        <Button size='small' color='secondary' disabled={isPending} onClick={() => { setEditing( false ); setChoice( null ) }}>Cancel</Button>
      </div>
      <NewProductDialog
        line={line}
        initialName={typed.trim().length > 2 ? typed.trim() : null}
        open={creating}
        onClose={() => setCreating( false )}
        onCreated={created}
      />
    </div>
  )
}
