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

import { deleteLiveClass } from '@/db/actions/liveClass'
import { useTableViewState } from '@/hooks/useTableViewState'
import { multiFieldFuzzyFilter } from '@/utils/multiFieldFuzzyFilter'
import { formatCurrency } from '../products/productFormat'
import LiveClassTableFilters from './LiveClassTableFilters'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [{id: 'startDate', desc: true}],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {location: ''},
}

// The 'name' column is the one meaningfully free-text searched - rank
// name + location (name/address/type) + notes as separate fields (see
// multiFieldFuzzyFilter's own doc comment for why not to concatenate them
// into one blob first, as this used to - it let a query's letters match
// merely by appearing scattered in order across the whole combined
// string), same "special-case the one display column + explicitly opt
// other columns out of global filtering" approach as
// customers/CustomersListTable.jsx, since e.g. "zoom" or "Portland"
// should find a class by its location even though neither appears in the
// class name itself.
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const c = row.original

  const itemRank = 'name' === columnId
    ? multiFieldFuzzyFilter( [
      c.name, c.locationName, c.locationAddress,
      'online' === c.locationType ? 'online zoom virtual' : 'in person',
      c.notes,
    ], value )
    : rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const columnHelper = createColumnHelper()

export default function LiveClassesListTable( {liveClassData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [filteredData, setFilteredData] = useState( liveClassData )
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'liveClasses', DEFAULT_VIEW )

  useEffect( () => { setFilteredData( liveClassData ) }, [liveClassData] )

  function handleDelete( liveClass )
  {
    if( !confirm( `Delete ${liveClass.name}? This also removes its attendee roster.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteLiveClass( liveClass.id )
        toast.success( 'Class deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the class' )
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'name', {
        header: 'Class',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={38}>
              <i className='ri-graduation-cap-line text-lg' />
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography component={Link} href={`/live-classes/${row.original.id}`} className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
              {row.original.locationName && <Typography variant='body2'>{row.original.locationName}</Typography>}
            </div>
          </div>
        ),
        enableGlobalFilter: true
      } ),
      columnHelper.accessor( 'locationType', {
        header: 'Location',
        cell: ({ row }) => (
          <Chip label={row.original.locationType === 'online' ? 'Online' : 'In Person'} variant='tonal' size='small' />
        ),
        enableGlobalFilter: false
      } ),
      columnHelper.accessor( 'startDate', {
        header: 'Start Date',
        cell: ({ row }) => <Typography>{row.original.startDate || '—'}</Typography>,
        enableGlobalFilter: false
      } ),
      columnHelper.accessor( 'cost', {
        header: 'Cost',
        cell: ({ row }) => <Typography>{formatCurrency( row.original.cost )}</Typography>,
        enableGlobalFilter: false
      } ),
      columnHelper.accessor( 'attendeeCount', {
        header: 'Attendees',
        cell: ({ row }) => (
          <Chip label={row.original.attendeeCount} variant='tonal' color={row.original.attendeeCount ? 'primary' : 'secondary'} size='small' />
        ),
        enableGlobalFilter: false
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' component={Link} href={`/live-classes/${row.original.id}/edit`}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' disabled={isPending} onClick={() => handleDelete( row.original )}>
              <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: false
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

    // See the matching comment in customers/CustomersListTable.jsx -
    // bypasses TanStack's default getColumnCanGlobalFilter heuristic (which
    // ANDs with, rather than being overridden by, each column's own
    // enableGlobalFilter) so 'name' below is reliably searchable even
    // though this heuristic currently happens to pass anyway (LiveClass
    // has a real .name field on its first row).
    getColumnCanGlobalFilter: () => true,
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
      <LiveClassTableFilters
        liveClassData={liveClassData}
        setData={setFilteredData}
        filters={view.filters}
        onFiltersChange={filters => updateView( {filters} )}
      />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <TextField
          size='small'
          value={view.globalFilter ?? ''}
          onChange={e => updateView( {globalFilter: e.target.value} )}
          placeholder='Search Classes'
          className='max-sm:is-full'
        />
        <Button
          variant='contained'
          component={Link}
          href='/live-classes/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New Class
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
                  No classes found
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
