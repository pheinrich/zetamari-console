'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { addOrderLine, removeOrderLines, setOrderLineQuantity, splitOrder } from '@/db/actions/order'
import { useConfirm } from '@/contexts/confirmContext'
import tableStyles from '@core/styles/table.module.css'
import { unitInputProps } from '@/utils/units'

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const withCount = (label, n) => n ? `${label} (${n})` : label

// Pieces past Design that cutting a line to `quantity` would delete -
// the least advanced go first (libs/orderLines.js), Design ones before any.
function startedLost( line, quantity )
{
  if( !line.makesPieces )
    return 0

  const pieces = Object.values( line.phaseCounts ).reduce( (n, c) => n + c, 0 )
  const design = line.phaseCounts.Design ?? 0

  return Math.max( 0, pieces - quantity - design )
}

// Typing searches SKU and name by each word, in any order; first 50.
function filterProducts( options, state )
{
  const typed = state.inputValue.trim().toLowerCase().split( /\s+/ ).filter( Boolean )

  return typed.length ? options.filter( o => typed.every( w => `${o.sku} ${o.name}`.toLowerCase().includes( w ) ) ).slice( 0, 50 ) : options.slice( 0, 50 )
}

// An Order's products, edited in place: quantities change as typed (on
// Enter or leaving the box), rows are deleted one at a time or selected
// and deleted together, a product is added at the foot, and selected
// rows can be split off into a new Order - see libs/orderLines.js for
// how Pieces follow each change.
export default function OrderLinesTable( {order, products} )
{
  const router = useRouter()
  const confirm = useConfirm()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState( new Set() )
  const [drafts, setDrafts] = useState( {} )   // productId -> typed quantity
  const [addKey, setAddKey] = useState( 0 )   // bumped to reset the add row after each add
  const [splitting, setSplitting] = useState( false )

  const lines = order.lines

  // A refresh brings new lines: drop drafts and selections that no longer apply
  useEffect( () => {
    const ids = new Set( lines.map( l => l.productId ) )

    setDrafts( {} )
    setSelected( prev => new Set( [...prev].filter( id => ids.has( id ) ) ) )
  }, [lines] )

  const selectedLines = lines.filter( l => selected.has( l.productId ) )
  const canSplit = order.unitCount > 1 && selectedLines.length > 0

  function toggle( productId )
  {
    setSelected( prev => {
      const next = new Set( prev )

      next.has( productId ) ? next.delete( productId ) : next.add( productId )

      return next
    } )
  }

  function toggleAll()
  {
    setSelected( selected.size === lines.length ? new Set() : new Set( lines.map( l => l.productId ) ) )
  }

  // Runs a server action, then reports and refreshes
  function act( work, success )
  {
    startTransition( async () => {
      const result = await work()

      if( result.error )
        return toast.error( result.error )

      if( success )
        toast.success( typeof success === 'function' ? success( result ) : success )

      router.refresh()
    } )
  }

  async function commitQuantity( line )
  {
    const typed = drafts[line.productId]

    if( typed === undefined )
      return

    const quantity = Number( typed )

    if( typed === '' || quantity === Number( line.quantity ) )
      return setDrafts( d => ({...d, [line.productId]: undefined}) )

    if( quantity === 0 )
      return remove( [line] )

    const lost = startedLost( line, quantity )

    if( lost && !await confirm( `Cutting ${line.Product?.name} to ${quantity} deletes ${plural( lost, 'piece' )} already past Design. Continue?`, {confirmText: 'Cut', destructive: true} ) )
      return setDrafts( d => ({...d, [line.productId]: undefined}) )

    act( () => setOrderLineQuantity( order.id, line.productId, quantity ) )
  }

  async function remove( toRemove )
  {
    const lost = toRemove.reduce( (n, l) => n + startedLost( l, 0 ), 0 )
    const names = toRemove.length === 1 ? toRemove[0].Product?.name : plural( toRemove.length, 'product' )
    const message = `Remove ${names} from Order #${order.id}?${lost ? ` ${plural( lost, 'piece' )} already past Design will be deleted.` : ''}`

    if( !await confirm( message, {confirmText: 'Remove', destructive: true} ) )
      return setDrafts( {} )

    act( () => removeOrderLines( order.id, toRemove.map( l => l.productId ) ), `Removed ${names}` )
  }

  return (
    <Card>
      <CardHeader
        title='Products'
        subheader={`${plural( lines.length, 'product' )}, ${plural( order.unitCount, 'item' )}`}
        action={(
          <div className='flex flex-wrap gap-4'>
            <Tooltip title={order.unitCount <= 1 ? 'A single item can\'t be split' : 'Move the selected products to a new order'}>
              <span>
                <Button
                  variant='outlined'
                  color='secondary'
                  disabled={isPending || !canSplit}
                  onClick={() => setSplitting( true )}
                  startIcon={<i className='ri-scissors-cut-line' />}
                >
                  {withCount( 'Split', selectedLines.length )}
                </Button>
              </span>
            </Tooltip>
            <Button
              variant='outlined'
              color='error'
              disabled={isPending || !selectedLines.length}
              onClick={() => remove( selectedLines )}
              startIcon={<i className='ri-delete-bin-7-line' />}
            >
              {withCount( 'Delete', selectedLines.length )}
            </Button>
          </div>
        )}
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className='is-[1%]'>
                <Checkbox
                  size='small'
                  checked={lines.length > 0 && selected.size === lines.length}
                  indeterminate={selected.size > 0 && selected.size < lines.length}
                  onChange={toggleAll}
                  disabled={!lines.length}
                  inputProps={{'aria-label': 'Select all products'}}
                />
              </th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!lines.length && (
              <tr><td colSpan={5} className='text-center'>No products yet</td></tr>
            )}
            {lines.map( line => (

              // OrderProduct has no id column (see its model) - one row per product
              <tr
                key={line.productId}
                className='cursor-pointer hover:bg-actionHover'
                onClick={e => !e.target.closest( 'a, button, input, label' ) && toggle( line.productId )}
              >
                <td className='is-[1%]'>
                  <Checkbox
                    size='small'
                    checked={selected.has( line.productId )}
                    onChange={() => toggle( line.productId )}
                    inputProps={{'aria-label': 'Select product'}}
                  />
                </td>
                <td className='min-is-[240px] max-is-[560px] whitespace-normal'>
                  <ProductCell product={line.Product} />
                </td>
                <td>
                  <TextField
                    size='small'
                    type='number'
                    value={drafts[line.productId] ?? line.quantity}
                    disabled={isPending}
                    onChange={e => setDrafts( d => ({...d, [line.productId]: e.target.value}) )}
                    onBlur={() => commitQuantity( line )}
                    onKeyDown={e => {
                      if( e.key === 'Enter' )
                        e.target.blur()
                      else if( e.key === 'Escape' )
                        setDrafts( d => ({...d, [line.productId]: undefined}) )
                    }}
                    slotProps={{
                      htmlInput: {min: 0, step: line.makesPieces ? 1 : 'any', 'aria-label': 'Quantity'},
                      input: unitInputProps( line.Product?.units || 'each' ),
                    }}
                    sx={{inlineSize: 150}}
                  />
                </td>
                <td className='whitespace-normal'>
                  <div className='flex flex-wrap gap-2'>
                    {Object.entries( line.phaseCounts ).map( ([phase, count]) => (
                      <Chip key={phase} size='small' variant='tonal' label={`${phase} × ${count}`} />
                    ) )}
                    {!Object.keys( line.phaseCounts ).length && (
                      <Typography variant='body2' color='text.secondary'>{line.makesPieces ? 'No pieces' : 'Not made here'}</Typography>
                    )}
                  </div>
                </td>
                <td>
                  <Tooltip title='Remove from order'>
                    <span>
                      <IconButton size='small' disabled={isPending} onClick={() => remove( [line] )}>
                        <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
                      </IconButton>
                    </span>
                  </Tooltip>
                </td>
              </tr>
            ) )}
            <AddLineRow
              key={addKey}
              products={products}
              disabled={isPending}
              autoFocus={addKey > 0}
              onAdd={(product, quantity) => act(
                async () => {
                  const result = await addOrderLine( order.id, product.id, quantity )

                  if( !result.error )
                    setAddKey( k => k + 1 )

                  return result
                },
                `Added ${product.name}`
              )}
            />
          </tbody>
        </table>
      </div>
      <SplitDialog
        open={splitting}
        order={order}
        lines={selectedLines}
        onClose={() => setSplitting( false )}
        onSplit={moves => act(
          async () => {
            const result = await splitOrder( order.id, moves )

            if( !result.error )
            {
              setSplitting( false )
              setSelected( new Set() )
            }

            return result
          },
          result => <>Split off <Link href={`/orders/${result.orderId}`}>Order #{result.orderId}</Link></>
        )}
        disabled={isPending}
      />
    </Card>
  )
}

// Name (linked) and SKU, with the product's description beneath -
// smaller, and wrapping rather than widening the row.
export function ProductCell( {product} )
{
  if( !product )
    return <Typography color='text.secondary'>Unknown product</Typography>

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap items-baseline gap-x-2'>
        <Link href={`/products/${product.id}`} onClick={e => e.stopPropagation()}>{product.name}</Link>
        <Typography component='span' variant='body2' color='text.secondary'>{product.sku}</Typography>
      </div>
      {product.description && (
        <Typography variant='body2' color='text.secondary' className='break-words'>{product.description}</Typography>
      )}
    </div>
  )
}

// Always at the foot of the table. Cleared after each add (by its parent
// remounting it), and focused again then so several can be added in a
// row - but not on page load.
function AddLineRow( {products, disabled, autoFocus, onAdd} )
{
  const [product, setProduct] = useState( null )
  const [quantity, setQuantity] = useState( '1' )
  const valid = product && Number( quantity ) > 0 && (!product.makesPieces || Number.isInteger( Number( quantity ) ))

  return (
    <tr>
      <td />
      <td className='min-is-[240px]'>
        <Autocomplete
          size='small'
          options={products}
          value={product}
          onChange={(e, value) => setProduct( value )}
          filterOptions={filterProducts}
          getOptionLabel={p => `${p.sku} - ${p.name}`}
          getOptionKey={p => p.id}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={({key, ...props}, p) => (
            <li key={key} {...props}>
              <div className='flex flex-col'>
                <span>{p.name}{p.status === 'hidden' && <Chip size='small' variant='tonal' label='hidden' className='mis-2' />}</span>
                <small className='text-textSecondary'>{p.sku}</small>
              </div>
            </li>
          )}
          openOnFocus
          renderInput={params => <TextField {...params} autoFocus={autoFocus} placeholder='Add a product: search SKU or name' />}
        />
      </td>
      <td>
        <TextField
          size='small'
          type='number'
          value={quantity}
          onChange={e => setQuantity( e.target.value )}
          onKeyDown={e => e.key === 'Enter' && valid && onAdd( product, Number( quantity ) )}
          slotProps={{
            htmlInput: {min: 0, step: product?.makesPieces === false ? 'any' : 1, 'aria-label': 'Quantity'},
            input: unitInputProps( product?.units || 'each' ),
          }}
          sx={{inlineSize: 150}}
        />
      </td>
      <td colSpan={2}>
        <Button size='small' variant='contained' disabled={disabled || !valid} onClick={() => onAdd( product, Number( quantity ) )}>Add</Button>
      </td>
    </tr>
  )
}

// How much of each selected product moves to the new Order - all of it
// by default, less one of the last when that would move the whole order.
function SplitDialog( {open, order, lines, onClose, onSplit, disabled} )
{
  const [moving, setMoving] = useState( {} )

  useEffect( () => {
    if( !open )
      return

    const initial = Object.fromEntries( lines.map( l => [l.productId, String( l.quantity )] ) )
    const total = lines.reduce( (n, l) => n + Number( l.quantity ), 0 )
    const last = lines.at( -1 )

    if( last && total >= order.unitCount )
      initial[last.productId] = String( Math.max( 0, Number( last.quantity ) - 1 ) )

    setMoving( initial )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open] )

  const moves = lines.map( l => ({productId: l.productId, quantity: Number( moving[l.productId] || 0 )}) )
  const moved = moves.reduce( (n, m) => n + m.quantity, 0 )

  const problem = useMemo( () => {
    for( const line of lines )
    {
      const n = Number( moving[line.productId] || 0 )

      if( n < 0 || n > Number( line.quantity ) )
        return `${line.Product?.name}: move between 0 and ${line.quantity}`

      if( line.makesPieces && !Number.isInteger( n ) )
        return `${line.Product?.name}: whole numbers only`
    }

    if( !moved )
      return 'Choose how many to move'

    if( moved >= order.unitCount )
      return 'Leave something on this order'

    return null
  }, [lines, moving, moved, order.unitCount] )

  return (
    <Dialog open={open} onClose={() => !disabled && onClose()} maxWidth='sm' fullWidth closeAfterTransition={false}>
      <DialogTitle>Split Order #{order.id}</DialogTitle>
      <DialogContent className='flex flex-col gap-4'>
        <Typography color='text.secondary'>
          Moves these to a new order for the same customer, with the same dates and channel orders. The most advanced pieces go with them.
        </Typography>
        <table className={tableStyles.table}>
          <thead><tr><th>Product</th><th>On order</th><th>Move</th></tr></thead>
          <tbody>
            {lines.map( line => (
              <tr key={line.productId}>
                <td className='whitespace-normal'>{line.Product?.name}</td>
                <td>{line.quantity}</td>
                <td>
                  <TextField
                    size='small'
                    type='number'
                    value={moving[line.productId] ?? ''}
                    onChange={e => setMoving( m => ({...m, [line.productId]: e.target.value}) )}
                    slotProps={{
                      htmlInput: {min: 0, max: line.quantity, step: line.makesPieces ? 1 : 'any', 'aria-label': 'Quantity to move'},
                      input: unitInputProps( line.Product?.units || 'each' ),
                    }}
                    sx={{inlineSize: 150}}
                  />
                </td>
              </tr>
            ) )}
          </tbody>
        </table>
        {problem && <Typography color='warning.main'>{problem}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button color='secondary' disabled={disabled} onClick={onClose}>Cancel</Button>
        <Button variant='contained' disabled={disabled || !!problem} onClick={() => onSplit( moves.filter( m => m.quantity > 0 ) )}>
          Split
        </Button>
      </DialogActions>
    </Dialog>
  )
}
