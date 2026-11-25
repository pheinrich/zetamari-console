'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

import { addStockItem, removeStockItems, setStockQuantity } from '@/db/actions/stock'
import { useConfirm } from '@/contexts/confirmContext'
import { useTableViewState } from '@/hooks/useTableViewState'
import tableStyles from '@core/styles/table.module.css'
import { unitInputProps } from '@/utils/units'
import { ProductCell, filterProducts } from '../orders/[id]/OrderLinesTable'

const DEFAULT_VIEW = {
  sorting: [{id: 'product', desc: false}],
  globalFilter: '',
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const withCount = (label, n) => n ? `${label} (${n})` : label

const updated = iso => new Date( iso ).toLocaleString( 'en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'} )

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const columnHelper = createColumnHelper()

// Inventory > Stock: the Products whose quantity on hand is tracked, laid
// out like an Order's product list - quantities edited in place (on Enter
// or leaving the box), rows deleted one at a time or selected and deleted
// together, and a Product added from the row always at the foot. Columns
// sort; the search narrows by SKU, name or type.
export default function StockTable( {stock, products} )
{
  const router = useRouter()
  const confirm = useConfirm()
  const [isPending, startTransition] = useTransition()
  const [rowSelection, setRowSelection] = useState( {} )
  const [drafts, setDrafts] = useState( {} )   // stock item id -> typed quantity
  const [addKey, setAddKey] = useState( 0 )   // bumped to reset the add row after each add
  const { view, updateView, onSortingChange } = useTableViewState( 'stock', DEFAULT_VIEW )

  const tracked = useMemo( () => new Set( stock.map( s => s.productId ) ), [stock] )
  const untracked = useMemo( () => products.filter( p => !tracked.has( p.id ) ), [products, tracked] )

  // A refresh brings new rows: drop drafts and selections that no longer apply
  useEffect( () => {
    const ids = new Set( stock.map( s => String( s.id ) ) )

    setDrafts( {} )
    setRowSelection( prev => Object.fromEntries( Object.entries( prev ).filter( ([id]) => ids.has( id ) ) ) )
  }, [stock] )

  // Runs a server action, then reports and refreshes
  function act( work, success )
  {
    startTransition( async () => {
      const result = await work()

      if( result.error )
        return toast.error( result.error )

      if( success )
        toast.success( success )

      router.refresh()
    } )
  }

  const clearDraft = id => setDrafts( d => ({...d, [id]: undefined}) )

  function commitQuantity( item )
  {
    const typed = drafts[item.id]

    if( typed === undefined )
      return

    if( typed === '' || Number( typed ) === item.quantity )
      return clearDraft( item.id )

    act( () => setStockQuantity( item.id, typed ) )
  }

  async function remove( items )
  {
    const names = items.length === 1 ? items[0].Product?.name : plural( items.length, 'product' )

    if( !await confirm( `Stop tracking stock of ${names}? The product${items.length === 1 ? '' : 's'} stay${items.length === 1 ? 's' : ''} in the catalog.`, {confirmText: 'Delete', destructive: true} ) )
      return

    act( () => removeStockItems( items.map( i => i.id ) ), `Stopped tracking ${names}` )
  }

  const columns = useMemo(
    () => [
      columnHelper.display( {
        id: 'select',
        header: ({table}) => (
          <Checkbox
            size='small'
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            disabled={!stock.length}
            inputProps={{'aria-label': 'Select all products'}}
          />
        ),
        cell: ({row}) => (
          <Checkbox
            size='small'
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            inputProps={{'aria-label': 'Select product'}}
          />
        ),
      } ),
      columnHelper.accessor( s => `${s.Product?.sku ?? ''} ${s.Product?.name ?? ''}`, {
        id: 'product',
        header: 'Product',
        sortingFn: (a, b) => (a.original.Product?.sku ?? '').localeCompare( b.original.Product?.sku ?? '', undefined, {numeric: true} ),
        cell: ({row}) => <ProductCell product={row.original.Product} />,
      } ),
      columnHelper.accessor( s => s.Product?.type ?? 'finished', {
        id: 'type',
        header: 'Type',
        cell: ({getValue}) => <Chip size='small' variant='tonal' label={getValue()} />,
      } ),
      columnHelper.accessor( 'quantity', {
        header: 'On hand',
        enableGlobalFilter: false,
        cell: ({row}) => {
          const item = row.original

          return (
            <TextField
              size='small'
              type='number'
              value={drafts[item.id] ?? item.quantity}
              disabled={isPending}
              onChange={e => setDrafts( d => ({...d, [item.id]: e.target.value}) )}
              onBlur={() => commitQuantity( item )}
              onKeyDown={e => {
                if( e.key === 'Enter' )
                  e.target.blur()
                else if( e.key === 'Escape' )
                  clearDraft( item.id )
              }}
              slotProps={{
                htmlInput: {min: 0, step: item.makesPieces ? 1 : 'any', 'aria-label': 'Quantity on hand'},
                input: unitInputProps( item.Product?.units || 'each' ),
              }}
              sx={{inlineSize: 150}}
            />
          )
        },
      } ),
      columnHelper.accessor( 'updatedAt', {
        header: 'Updated',
        enableGlobalFilter: false,
        cell: ({getValue}) => <Typography variant='body2' noWrap>{updated( getValue() )}</Typography>,
      } ),
      columnHelper.display( {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => (
          <Tooltip title='Stop tracking'>
            <span>
              <IconButton size='small' disabled={isPending} onClick={() => remove( [row.original] )}>
                <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
              </IconButton>
            </span>
          </Tooltip>
        ),
      } ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stock, drafts, isPending]
  )

  const table = useReactTable( {
    data: stock,
    columns,
    filterFns: {fuzzy: fuzzyFilter},
    state: {sorting: view.sorting, globalFilter: view.globalFilter, rowSelection},
    getRowId: row => String( row.id ),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: fuzzyFilter,
    onSortingChange,
    onGlobalFilterChange: value => updateView( {globalFilter: value} ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  } )

  // Selected rows still shown (the search can hide some) are what Delete acts on
  const selectedItems = table.getFilteredSelectedRowModel().rows.map( r => r.original )
  const rows = table.getRowModel().rows

  return (
    <Card>
      <CardHeader
        title='Stock'
        subheader={`${plural( stock.length, 'product' )} tracked`}
        action={(
          <div className='flex flex-wrap gap-4'>
            <TextField
              size='small'
              value={view.globalFilter ?? ''}
              onChange={e => updateView( {globalFilter: e.target.value} )}
              placeholder='Search Stock'
            />
            <Button
              variant='outlined'
              color='error'
              disabled={isPending || !selectedItems.length}
              onClick={() => remove( selectedItems )}
              startIcon={<i className='ri-delete-bin-7-line' />}
            >
              {withCount( 'Delete', selectedItems.length )}
            </Button>
          </div>
        )}
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map( headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map( header => (
                  <th key={header.id} className={header.id === 'select' ? 'is-[1%]' : undefined}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames( {
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort(),
                        } )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender( header.column.columnDef.header, header.getContext() )}
                        {{
                          asc: <i className='ri-arrow-up-s-line text-xl' />,
                          desc: <i className='ri-arrow-down-s-line text-xl' />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  {stock.length ? 'No stock matches the search' : 'No stock tracked yet'}
                </td>
              </tr>
            )}
            {rows.map( row => (
              <tr
                key={row.id}
                className='cursor-pointer hover:bg-actionHover'
                onClick={e => !e.target.closest( 'a, button, input, label' ) && row.toggleSelected()}
              >
                {row.getVisibleCells().map( cell => (
                  <td
                    key={cell.id}
                    className={cell.column.id === 'select' ? 'is-[1%]' : cell.column.id === 'product' ? 'min-is-[240px] max-is-[560px] whitespace-normal' : undefined}
                  >
                    {flexRender( cell.column.columnDef.cell, cell.getContext() )}
                  </td>
                ) )}
              </tr>
            ) )}
            <AddStockRow
              key={addKey}
              products={untracked}
              disabled={isPending}
              autoFocus={addKey > 0}
              onAdd={(product, quantity) => act(
                async () => {
                  const result = await addStockItem( product.id, quantity )

                  if( !result.error )
                    setAddKey( k => k + 1 )

                  return result
                },
                `Tracking ${product.name}`
              )}
            />
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Always at the foot of the table, offering only Products not yet
// tracked. Cleared after each add (by its parent remounting it), and
// focused again then so several can be added in a row - but not on page
// load.
function AddStockRow( {products, disabled, autoFocus, onAdd} )
{
  const [product, setProduct] = useState( null )
  const [quantity, setQuantity] = useState( '' )
  const n = Number( quantity )
  const valid = product && quantity !== '' && n >= 0 && (!product.makesPieces || Number.isInteger( n ))

  return (
    <tr>
      <td />
      <td className='min-is-[240px]' colSpan={2}>
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
          renderInput={params => <TextField {...params} autoFocus={autoFocus} placeholder='Track a product: search SKU or name' />}
        />
      </td>
      <td>
        <TextField
          size='small'
          type='number'
          value={quantity}
          placeholder='On hand'
          onChange={e => setQuantity( e.target.value )}
          onKeyDown={e => e.key === 'Enter' && valid && onAdd( product, n )}
          slotProps={{
            htmlInput: {min: 0, step: product?.makesPieces === false ? 'any' : 1, 'aria-label': 'Quantity on hand'},
            input: unitInputProps( product?.units || 'each' ),
          }}
          sx={{inlineSize: 150}}
        />
      </td>
      <td colSpan={2}>
        <Button size='small' variant='contained' disabled={disabled || !valid} onClick={() => onAdd( product, n )}>Add</Button>
      </td>
    </tr>
  )
}
