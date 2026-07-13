'use client'

import { useMemo, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
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

import { deleteUser } from '@/db/actions/user'
import { useTableViewState } from '@/hooks/useTableViewState'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )
  addMeta( {itemRank} )
  return itemRank.passed
}

function initials( name )
{
  return (name || '')
    .split( ' ' )
    .filter( Boolean )
    .slice( 0, 2 )
    .map( part => part[0].toUpperCase() )
    .join( '' )
}

const columnHelper = createColumnHelper()

export default function UsersListTable( {userData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'users', DEFAULT_VIEW )

  function handleDelete( user )
  {
    if( !confirm( `Delete ${user.name}? This cannot be undone.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteUser( user.id )
        toast.success( 'User deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the user' )
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'name', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={38}>
              {initials( row.original.name )}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography component={Link} href={`/users/${row.original.id}`} className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' component={Link} href={`/users/${row.original.id}/edit`}>
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
    data: userData,
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
      <CardHeader title='Users' className='pbe-4' />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <TextField
          size='small'
          value={view.globalFilter ?? ''}
          onChange={e => updateView( {globalFilter: e.target.value} )}
          placeholder='Search Users'
          className='max-sm:is-full'
        />
        <Button
          variant='contained'
          component={Link}
          href='/users/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New User
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
                  No users found
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
