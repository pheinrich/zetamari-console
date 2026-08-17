'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
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
import { customerDisplayName } from '../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [{id: 'promisedDate', desc: false}],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {atRiskOnly: false},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

function originLabel( origin )
{
  if( 'explicit' === origin )
    return 'Explicit'
  if( 'computed' === origin )
    return 'Computed'

  return null
}

const columnHelper = createColumnHelper()

export default function OrdersListTable( {orderData} )
{
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'orders', DEFAULT_VIEW )

  const filters = {...DEFAULT_VIEW.filters, ...view.filters}

  const filteredData = useMemo(
    () => filters.atRiskOnly ? orderData.filter( o => o.isAtRisk ) : orderData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderData, filters.atRiskOnly]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'id', {
        header: 'Order',
        cell: ({ row }) => <Link href={`/orders/${row.original.id}`}>#{row.original.id}</Link>
      } ),
      columnHelper.accessor( o => customerDisplayName( o.Customer ), {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => <Typography>{customerDisplayName( row.original.Customer )}</Typography>
      } ),
      columnHelper.accessor( 'itemCount', {
        header: 'Items',
        cell: ({ row }) => <Typography>{row.original.itemCount}</Typography>
      } ),
      columnHelper.accessor( 'promisedDate', {
        header: 'Promised',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Typography>{row.original.promisedDate || '—'}</Typography>
            {originLabel( row.original.promisedDateOrigin ) && (
              <Chip label={originLabel( row.original.promisedDateOrigin )} variant='tonal' size='small' />
            )}
          </div>
        )
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
        <Button
          variant='contained'
          component={Link}
          href='/orders/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New Order
        </Button>
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
                <tr key={row.id}>
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
