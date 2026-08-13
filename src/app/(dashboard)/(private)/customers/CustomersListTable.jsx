'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
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

import CustomerTableFilters from './CustomerTableFilters'
import { customerDisplayName } from './customerFormat'
import { deleteCustomer } from '@/db/actions/customer'
import { useTableViewState } from '@/hooks/useTableViewState'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {type: '', student: '', marketing: ''},
}

// The 'name' column is the one meaningfully free-text searched - rank
// against name + email + phone together (same "special-case the one
// display column" approach as products/ProductListTable.jsx's SKU
// search), since a person is just as likely to be looked up by email or
// phone as by name here.
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const target = 'name' === columnId
    ? `${customerDisplayName( row.original )} ${row.original.email ?? ''} ${row.original.phone ?? ''}`
    : row.getValue( columnId )

  const itemRank = rankItem( target, value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState( initialValue )

  useEffect( () => { setValue( initialValue ) }, [initialValue] )
  useEffect( () => {
    const timeout = setTimeout( () => onChange( value ), debounce )

    return () => clearTimeout( timeout )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value] )

  return <TextField {...props} value={value} onChange={e => setValue( e.target.value )} size='small' />
}

const columnHelper = createColumnHelper()

export default function CustomersListTable( {customerData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState( customerData )
  const [filteredData, setFilteredData] = useState( customerData )
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'customers', DEFAULT_VIEW )

  useEffect( () => { setData( customerData ) }, [customerData] )

  function handleDelete( customer )
  {
    if( !confirm( `Delete ${customerDisplayName( customer )}? This also removes their sources and class attendance history.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteCustomer( customer.id )
        toast.success( 'Customer deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the customer' )
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'name', {
        header: 'Customer',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={38}>
              <i className='ri-user-line text-lg' />
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography component={Link} href={`/customers/${row.original.id}`} className='font-medium' color='text.primary'>
                {customerDisplayName( row.original )}
              </Typography>
              {row.original.email && <Typography variant='body2'>{row.original.email}</Typography>}
            </div>
          </div>
        )
      } ),
      columnHelper.accessor( 'type', {
        header: 'Type',
        cell: ({ row }) => row.original.type
          ? <Chip label={row.original.type === 'wholesale' ? 'Wholesale' : 'Retail'} variant='tonal' size='small' />
          : <Typography color='text.secondary'>—</Typography>
      } ),
      columnHelper.accessor( 'phone', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone || '—'}</Typography>
      } ),
      columnHelper.accessor( 'orderCount', {
        header: 'Orders',
        cell: ({ row }) => (
          <Chip label={row.original.orderCount} variant='tonal' color={row.original.orderCount ? 'primary' : 'secondary'} size='small' />
        )
      } ),
      columnHelper.accessor( 'classCount', {
        header: 'Classes',
        cell: ({ row }) => (
          <Chip label={row.original.classCount} variant='tonal' color={row.original.classCount ? 'success' : 'secondary'} size='small' />
        )
      } ),
      columnHelper.accessor( 'createdOn', {
        header: 'Created',
        cell: ({ row }) => <Typography>{row.original.createdOn || '—'}</Typography>
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' component={Link} href={`/customers/${row.original.id}/edit`}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' disabled={isPending} onClick={() => handleDelete( row.original )}>
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
      <CardHeader title='Filters' className='pbe-4' />
      <CustomerTableFilters
        customerData={data}
        setData={setFilteredData}
        filters={view.filters}
        onFiltersChange={filters => updateView( {filters} )}
      />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <DebouncedInput
          value={view.globalFilter ?? ''}
          onChange={value => updateView( {globalFilter: String( value )} )}
          placeholder='Search Customers'
          className='max-sm:is-full'
        />
        <Button
          variant='contained'
          component={Link}
          href='/customers/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New Customer
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
                  No customers found
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
