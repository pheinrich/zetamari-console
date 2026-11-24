'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'

import { combineOrders, deleteOrders } from '@/db/actions/order'
import { useTableViewState } from '@/hooks/useTableViewState'
import { customerDisplayName } from '../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'
import { useConfirm } from '@/contexts/confirmContext'
import { channelLabel, shipDateText } from '../channel-orders/channelOrderFormat'

const DEFAULT_VIEW = {
  sorting: [{id: 'shipDate', desc: false}],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {atRiskOnly: false},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const ORIGIN_LABELS = {explicit: 'Explicit', computed: 'Computed', default: 'Default'}

const plural = n => `${n} order${n === 1 ? '' : 's'}`
const withCount = (label, n) => n ? `${label} (${n})` : label

const columnHelper = createColumnHelper()

// Why the selected orders can't be combined, if they can't (the server
// checks the same - libs/orderLines.js's combineOrders()).
function whyNotCombine( orders )
{
  if( orders.length < 2 )
    return 'Select two or more orders of one customer'

  if( new Set( orders.map( o => o.customerId ) ).size > 1 )
    return 'Only one customer\'s orders can be combined'

  if( orders.some( o => o.completedOn ) )
    return 'Shipped orders can\'t be combined'

  return null
}

export default function OrdersListTable( {orderData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()
  const [rowSelection, setRowSelection] = useState( {} )
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'orders', DEFAULT_VIEW )

  const filters = {...DEFAULT_VIEW.filters, ...view.filters}

  const filteredData = useMemo(
    () => filters.atRiskOnly ? orderData.filter( o => o.isAtRisk ) : orderData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderData, filters.atRiskOnly]
  )

  // Each batch action ends the same way: clear the selection, say what
  // happened, and reload.
  function act( work, success )
  {
    startTransition( async () => {
      const result = await work()

      if( result.error )
        return toast.error( result.error )

      toast.success( typeof success === 'function' ? success( result ) : success )
      setRowSelection( {} )
      router.refresh()
    } )
  }

  async function handleDelete( orders )
  {
    const what = orders.length === 1 ? `order #${orders[0].id}` : plural( orders.length )

    if( !await confirm( `Delete ${what}? This removes their Pieces and cannot be undone. Channel orders they came from go back to review.`, {confirmText: 'Delete', destructive: true} ) )
      return

    act( () => deleteOrders( orders.map( o => o.id ) ), `Deleted ${what}` )
  }

  async function handleCombine()
  {
    const [into] = [...selectedOrders].sort( (a, b) => a.id - b.id )

    if( !await confirm( `Combine ${plural( selectedOrders.length )} into Order #${into.id}? Their products, pieces and channel orders move to it, and the others are deleted.`, {confirmText: 'Combine'} ) )
      return

    act( () => combineOrders( selectedOrders.map( o => o.id ) ), result => `Combined into Order #${result.orderId}` )
  }

  const columns = useMemo(
    () => [
      columnHelper.display( {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            size='small'
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            inputProps={{'aria-label': 'Select all orders'}}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size='small'
            checked={row.getIsSelected()}
            onClick={e => e.stopPropagation()}
            onChange={row.getToggleSelectedHandler()}
            inputProps={{'aria-label': 'Select order'}}
          />
        )
      } ),
      columnHelper.accessor( 'id', {
        header: 'Order',
        // Also its own link (not just relying on the row click below) -
        // keeps this keyboard-focusable and openable in a new tab.
        cell: ({ row }) => <Link href={`/orders/${row.original.id}`}>#{row.original.id}</Link>
      } ),
      columnHelper.accessor( o => customerDisplayName( o.Customer ), {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => <Typography>{customerDisplayName( row.original.Customer )}</Typography>
      } ),
      columnHelper.accessor( o => o.ChannelOrders.map( c => `${channelLabel( c.channel )} #${c.externalOrderId}` ).join( ' ' ), {
        id: 'source',
        header: 'Source',
        cell: ({ row }) => row.original.ChannelOrders.length
          ? (
            <div className='flex flex-col' onClick={e => e.stopPropagation()}>
              {row.original.ChannelOrders.map( c => (
                <Link key={c.id} href={`/channel-orders/${c.id}`}>{channelLabel( c.channel )} #{c.externalOrderId}</Link>
              ) )}
            </div>
          )
          : <Typography color='text.secondary'>Direct</Typography>
      } ),
      columnHelper.accessor( 'unitCount', {
        header: 'Items',
        cell: ({ row }) => (
          <Tooltip title={`${row.original.itemCount} product${row.original.itemCount === 1 ? '' : 's'}`}>
            <Typography>{row.original.unitCount}</Typography>
          </Tooltip>
        )
      } ),
      columnHelper.accessor( 'shipDate', {
        header: 'Ship by',
        cell: ({ row }) => {
          const o = row.original
          const via = [...new Set( o.ChannelOrders.map( c => c.shippingMethod ).filter( Boolean ) )].join( ', ' )

          return (
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <Typography className='whitespace-nowrap' color={o.shipDateOrigin === 'default' ? 'text.secondary' : undefined}>{shipDateText( o.shipDate )}</Typography>
                {ORIGIN_LABELS[o.shipDateOrigin] && <Chip label={ORIGIN_LABELS[o.shipDateOrigin]} variant='tonal' size='small' />}
              </div>
              {via && <Typography variant='body2' color='text.secondary'>{via}</Typography>}
            </div>
          )
        }
      } ),
      columnHelper.accessor( 'projectedCompletionDate', {
        header: 'Projected',
        cell: ({ row }) => <Typography>{row.original.projectedCompletionDate || '—'}</Typography>
      } ),
      columnHelper.accessor( o => o.GroutingDay?.date, {
        id: 'groutingDay',
        header: 'Grouting Day',
        cell: ({ row }) => <Typography>{row.original.GroutingDay?.date || '—'}</Typography>
      } ),
      columnHelper.accessor( 'isAtRisk', {
        header: 'Status',
        cell: ({ row }) => row.original.isAtRisk
          ? <Chip label='At Risk' variant='tonal' color='error' size='small' />
          : null,
        enableSorting: false
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          // Row itself navigates on click (see the <tr onClick> below) -
          // stopPropagation here so these buttons don't also trigger it.
          <div className='flex items-center' onClick={e => e.stopPropagation()}>
            <IconButton size='small' component={Link} href={`/orders/${row.original.id}/edit`}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' disabled={isPending} onClick={() => handleDelete( [row.original] )}>
              <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      } ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPending]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { sorting: view.sorting, pagination: view.pagination, globalFilter: view.globalFilter, rowSelection },
    getRowId: row => String( row.id ),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: fuzzyFilter,
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange: value => updateView( {globalFilter: value} ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Selected rows still shown (a filter or search can hide some). Only one
  // customer's orders, none shipped, can be combined.
  const selectedOrders = table.getFilteredSelectedRowModel().rows.map( r => r.original )
  const combineBlocker = whyNotCombine( selectedOrders )

  return (
    <Card>
      <CardHeader title='Orders' className='pbe-4' />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <div className='flex flex-wrap items-center gap-4'>
          <TextField
            size='small'
            value={view.globalFilter ?? ''}
            onChange={e => updateView( {globalFilter: e.target.value} )}
            placeholder='Search Orders'
            className='max-sm:is-full'
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.atRiskOnly}
                onChange={e => updateView( {filters: {...filters, atRiskOnly: e.target.checked}} )}
              />
            }
            label='At Risk only'
          />
        </div>
        <div className='flex flex-wrap gap-4 max-sm:is-full'>
          <Tooltip title={combineBlocker ?? 'Merge the selected orders into the oldest'}>
            <span>
              <Button
                variant='outlined'
                color='secondary'
                disabled={isPending || !!combineBlocker}
                onClick={handleCombine}
                startIcon={<i className='ri-merge-cells-horizontal' />}
              >
                {withCount( 'Combine', selectedOrders.length >= 2 ? selectedOrders.length : 0 )}
              </Button>
            </span>
          </Tooltip>
          <Button
            variant='outlined'
            color='error'
            disabled={isPending || !selectedOrders.length}
            onClick={() => handleDelete( selectedOrders )}
            startIcon={<i className='ri-delete-bin-7-line' />}
          >
            {withCount( 'Delete', selectedOrders.length )}
          </Button>
          <Button
            variant='contained'
            component={Link}
            href='/orders/new'
            startIcon={<i className='ri-add-line' />}
          >
            New Order
          </Button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map( headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map( header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames( {
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        } )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender( header.column.columnDef.header, header.getContext() )}
                        {{
                          asc: <i className='ri-arrow-up-s-line text-xl' />,
                          desc: <i className='ri-arrow-down-s-line text-xl' />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No orders found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.slice( 0, table.getState().pagination.pageSize ).map( row => (
                <tr
                  key={row.id}
                  className='cursor-pointer hover:bg-actionHover'
                  onClick={() => router.push( `/orders/${row.original.id}` )}
                >
                  {row.getVisibleCells().map( cell => (
                    <td key={cell.id} className={cell.column.id === 'select' ? 'is-[1%]' : undefined}>{flexRender( cell.column.columnDef.cell, cell.getContext() )}</td>
                  ) )}
                </tr>
              ) )}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        className='border-bs'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex( page )}
        onRowsPerPageChange={e => table.setPageSize( Number( e.target.value ) )}
      />
    </Card>
  )
}
