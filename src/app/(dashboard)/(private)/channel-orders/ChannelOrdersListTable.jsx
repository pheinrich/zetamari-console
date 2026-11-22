'use client'

import { useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
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

import { useTableViewState } from '@/hooks/useTableViewState'
import tableStyles from '@core/styles/table.module.css'
import { ORDER_STATUS_COLORS, buyerLabel, channelLabel, money, orderAmount } from './channelOrderFormat'

// Defaults to the review queue - orders still 'new'.
const DEFAULT_VIEW = {
  sorting: [{id: 'orderedOn', desc: true}],
  pagination: {pageIndex: 0, pageSize: 25},
  globalFilter: '',
  filters: {status: 'new', channel: ''},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const columnHelper = createColumnHelper()

export default function ChannelOrdersListTable( {orderData, etsy, etsyOutcome} )
{
  // Lines still to match on orders under review - see /channel-orders/unmatched
  const unmatchedCount = orderData.filter( o => o.status === 'new' ).reduce( (n, o) => n + o.lineCount - o.matchedCount, 0 )

  const router = useRouter()
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'channelOrders', DEFAULT_VIEW )

  const filters = {...DEFAULT_VIEW.filters, ...view.filters}
  const channels = useMemo( () => [...new Set( orderData.map( o => o.channel ) )].sort(), [orderData] )

  const filteredData = useMemo(
    () => orderData.filter( o => (!filters.status || o.status === filters.status) && (!filters.channel || o.channel === filters.channel) ),
    [orderData, filters.status, filters.channel]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor( o => channelLabel( o.channel ), {
        id: 'channel',
        header: 'Channel',
        cell: ({ getValue }) => <Typography>{getValue()}</Typography>
      } ),
      columnHelper.accessor( 'externalOrderId', {
        header: 'Order',
        cell: ({ row }) => <Link href={`/channel-orders/${row.original.id}`}>#{row.original.externalOrderId}</Link>
      } ),
      columnHelper.accessor( 'orderedOn', {
        header: 'Ordered',
        cell: ({ getValue }) => <Typography>{getValue() || '—'}</Typography>
      } ),
      columnHelper.accessor( o => buyerLabel( o ), {
        id: 'buyer',
        header: 'Buyer',
        cell: ({ getValue }) => <Typography>{getValue()}</Typography>
      } ),
      columnHelper.accessor( 'lineCount', {
        header: 'Lines',
        cell: ({ row }) => {
          const o = row.original
          const allMatched = o.lineCount > 0 && o.matchedCount === o.lineCount

          return (
            <div className='flex items-center gap-2'>
              <Typography>{o.lineCount}{o.expectedLineCount && o.expectedLineCount !== o.lineCount ? ` of ${o.expectedLineCount}` : ''}</Typography>
              <Chip size='small' variant='tonal' color={allMatched ? 'success' : 'warning'} label={`${o.matchedCount} matched`} />
            </div>
          )
        }
      } ),
      columnHelper.accessor( o => Number( orderAmount( o ) ?? -1 ), {
        id: 'amount',
        header: 'Amount',
        cell: ({ row }) => <Typography>{money( orderAmount( row.original ) )}</Typography>
      } ),
      columnHelper.accessor( 'status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex flex-wrap items-center gap-2'>
            <Chip size='small' variant='tonal' color={ORDER_STATUS_COLORS[row.original.status]} label={row.original.status} />
            {!row.original.linesComplete && <Chip size='small' variant='tonal' color='warning' label='incomplete' />}
          </div>
        )
      } ),
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { sorting: view.sorting, pagination: view.pagination, globalFilter: view.globalFilter },
    globalFilterFn: fuzzyFilter,
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange: value => updateView( {globalFilter: value} ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card>
      <CardHeader
        title='Channel Orders'
        subheader='Orders received from sales channels, awaiting review'
        action={(
          <div className='flex flex-wrap items-center gap-4'>
            {unmatchedCount > 0 && (
              <Button component={Link} href='/channel-orders/unmatched' variant='tonal' color='warning' startIcon={<i className='ri-links-line' />}>
                {unmatchedCount} unmatched line{unmatchedCount === 1 ? '' : 's'}
              </Button>
            )}
            <EtsyConnection etsy={etsy} />
          </div>
        )}
        className='pbe-4'
      />
      {etsyOutcome && (
        <Alert severity={etsyOutcome === 'connected' ? 'success' : 'error'} className='mli-5 mbe-4'>
          {etsyOutcome === 'connected' ? `Etsy connected${etsy?.shopName ? ` (${etsy.shopName})` : ''}` : `Couldn't connect Etsy: ${etsyOutcome}`}
        </Alert>
      )}
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <div className='flex flex-wrap items-center gap-4'>
          <TextField
            size='small'
            value={view.globalFilter ?? ''}
            onChange={e => updateView( {globalFilter: e.target.value} )}
            placeholder='Search Channel Orders'
            className='max-sm:is-full'
          />
          <TextField
            select
            size='small'
            label='Status'
            value={filters.status}
            onChange={e => updateView( {filters: {...filters, status: e.target.value}} )}
            className='min-is-[140px]'
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='new'>New</MenuItem>
            <MenuItem value='accepted'>Accepted</MenuItem>
            <MenuItem value='dismissed'>Dismissed</MenuItem>
          </TextField>
          <TextField
            select
            size='small'
            label='Channel'
            value={filters.channel}
            onChange={e => updateView( {filters: {...filters, channel: e.target.value}} )}
            className='min-is-[160px]'
          >
            <MenuItem value=''>All</MenuItem>
            {channels.map( c => <MenuItem key={c} value={c}>{channelLabel( c )}</MenuItem> )}
          </TextField>
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
                  No channel orders found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map( row => (
                <tr
                  key={row.id}
                  className='cursor-pointer hover:bg-actionHover'
                  onClick={() => router.push( `/channel-orders/${row.original.id}` )}
                >
                  {row.getVisibleCells().map( cell => (
                    <td key={cell.id}>{flexRender( cell.column.columnDef.cell, cell.getContext() )}</td>
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

// Etsy's API needs the shop owner's one-time approval (see
// libs/channelOrders/etsyApi.js); /api/etsy/connect starts it. A plain
// link, not next/link - it's a server redirect out to Etsy.
function EtsyConnection( {etsy} )
{
  if( !etsy?.configured )
    return null

  return (
    <div className='flex items-center gap-2'>
      <Chip
        size='small'
        variant='tonal'
        color={etsy.connected ? 'success' : 'warning'}
        label={etsy.connected ? `Etsy: ${etsy.shopName ?? 'connected'}` : 'Etsy: not connected'}
      />
      <Button size='small' variant='text' href='/api/etsy/connect'>
        {etsy.connected ? 'Reconnect' : 'Connect Etsy'}
      </Button>
    </div>
  )
}
