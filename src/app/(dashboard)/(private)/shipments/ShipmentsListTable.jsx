'use client'

import { useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
} from '@tanstack/react-table'

import { useTableViewState } from '@/hooks/useTableViewState'
import tableStyles from '@core/styles/table.module.css'
import { SHIPMENT_STEPS, STEP_COLORS, TRANSPORT_MODES, TRANSPORT_MODE_LABELS } from '@/utils/shipments'
import { customerDisplayName } from '../customers/customerFormat'

const STEPS = [...SHIPMENT_STEPS.map( s => s.step ), 'Done']

const DEFAULT_VIEW = {
  sorting: [{id: 'id', desc: true}],
  pagination: {pageIndex: 0, pageSize: 25},
  globalFilter: '',
  filters: {step: 'open', mode: ''},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const columnHelper = createColumnHelper()

// Every Order's Shipments in one queue - by default those not yet handed
// off, filterable by step and transport mode. A row opens its Order,
// where the Shipment is worked (see OrderShipments.jsx).
export default function ShipmentsListTable( {shipments} )
{
  const router = useRouter()
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'shipments', DEFAULT_VIEW )
  const filters = {...DEFAULT_VIEW.filters, ...view.filters}

  const filtered = useMemo(
    () => shipments.filter( s => (
      (filters.step === '' || (filters.step === 'open' ? s.step !== 'Done' : s.step === filters.step))
      && (!filters.mode || (filters.mode === 'none' ? !s.transportMode : s.transportMode === filters.mode))
    ) ),
    [shipments, filters.step, filters.mode]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'id', {
        header: 'Shipment',
        cell: ({getValue}) => <Typography>#{getValue()}</Typography>,
      } ),
      columnHelper.accessor( s => s.orderId, {
        id: 'order',
        header: 'Order',
        cell: ({row}) => <Link href={`/orders/${row.original.orderId}#shipment-${row.original.id}`}>#{row.original.orderId}</Link>,
      } ),
      columnHelper.accessor( s => customerDisplayName( s.Order?.Customer ) ?? '', {
        id: 'customer',
        header: 'Customer',
        cell: ({getValue}) => <Typography noWrap>{getValue() || '—'}</Typography>,
      } ),
      columnHelper.accessor( s => STEPS.indexOf( s.step ), {
        id: 'step',
        header: 'Step',
        cell: ({row}) => <Chip size='small' variant='tonal' color={STEP_COLORS[row.original.step]} label={row.original.step === 'Done' ? 'Handed off' : row.original.step} />,
      } ),
      columnHelper.accessor( s => TRANSPORT_MODE_LABELS[s.transportMode] ?? '', {
        id: 'mode',
        header: 'Transport',
        cell: ({getValue}) => getValue() || <Typography color='text.secondary'>Not decided</Typography>,
      } ),
      columnHelper.accessor( s => [s.carrier, s.service, s.tracking].filter( Boolean ).join( ' ' ), {
        id: 'carrier',
        header: 'Carrier',
        cell: ({row}) => (
          <div className='flex flex-col'>
            <Typography noWrap>{[row.original.carrier, row.original.service].filter( Boolean ).join( ' · ' ) || '—'}</Typography>
            {row.original.tracking && <Typography variant='body2' color='text.secondary' noWrap>{row.original.tracking}</Typography>}
          </div>
        ),
      } ),
      columnHelper.accessor( s => s.Lines.map( l => `${l.quantity} × ${l.Product?.sku ?? ''}` ).join( ', ' ), {
        id: 'products',
        header: 'Products',
        enableSorting: false,
        cell: ({getValue}) => <Typography variant='body2' className='whitespace-normal'>{getValue()}</Typography>,
      } ),
      columnHelper.accessor( 'createdOn', {
        header: 'Created',
        cell: ({getValue}) => <Typography noWrap>{getValue()}</Typography>,
      } ),
    ],
    []
  )

  const table = useReactTable( {
    data: filtered,
    columns,
    filterFns: {fuzzy: fuzzyFilter},
    state: {sorting: view.sorting, pagination: view.pagination, globalFilter: view.globalFilter},
    getRowId: row => String( row.id ),
    globalFilterFn: fuzzyFilter,
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange: value => updateView( {globalFilter: value} ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  } )

  const rows = table.getRowModel().rows

  return (
    <Card>
      <CardHeader title='Shipments' subheader={`${table.getFilteredRowModel().rows.length} of ${shipments.length}`} />
      <div className='flex flex-wrap gap-4 pli-5 pbe-5'>
        <TextField
          size='small'
          value={view.globalFilter ?? ''}
          onChange={e => updateView( {globalFilter: e.target.value} )}
          placeholder='Search Shipments'
          className='max-sm:is-full'
        />
        <TextField
          select
          size='small'
          label='Step'
          value={filters.step}
          onChange={e => updateView( {filters: {...filters, step: e.target.value}} )}
          className='min-is-[160px]'
        >
          <MenuItem value='open'>Not handed off</MenuItem>
          <MenuItem value=''>All</MenuItem>
          {STEPS.map( s => <MenuItem key={s} value={s}>{s === 'Done' ? 'Handed off' : s}</MenuItem> )}
        </TextField>
        <TextField
          select
          size='small'
          label='Transport'
          value={filters.mode}
          onChange={e => updateView( {filters: {...filters, mode: e.target.value}} )}
          className='min-is-[160px]'
        >
          <MenuItem value=''>All</MenuItem>
          {TRANSPORT_MODES.map( m => <MenuItem key={m} value={m}>{TRANSPORT_MODE_LABELS[m]}</MenuItem> )}
          <MenuItem value='none'>Not decided</MenuItem>
        </TextField>
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map( headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map( header => (
                  <th key={header.id}>
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
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          <tbody>
            {!rows.length && (
              <tr><td colSpan={columns.length} className='text-center'>No shipments found</td></tr>
            )}
            {rows.map( row => (
              <tr
                key={row.id}
                className='cursor-pointer hover:bg-actionHover'
                onClick={e => !e.target.closest( 'a' ) && router.push( `/orders/${row.original.orderId}#shipment-${row.original.id}` )}
              >
                {row.getVisibleCells().map( cell => (
                  <td key={cell.id}>{flexRender( cell.column.columnDef.cell, cell.getContext() )}</td>
                ) )}
              </tr>
            ) )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component='div'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_, page) => table.setPageIndex( page )}
        onRowsPerPageChange={e => table.setPageSize( Number( e.target.value ) )}
      />
    </Card>
  )
}
