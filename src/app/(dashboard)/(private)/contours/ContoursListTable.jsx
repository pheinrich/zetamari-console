'use client'

import { useMemo, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
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

import ContourThumbnail from './ContourThumbnail'
import { deleteContour } from '@/db/actions/contour'
import { useTableViewState } from '@/hooks/useTableViewState'
import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {kind: ''},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )
  addMeta( {itemRank} )
  return itemRank.passed
}

const columnHelper = createColumnHelper()

export default function ContoursListTable( {contourData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'contours', DEFAULT_VIEW )
  const kind = view.filters.kind

  const filteredData = useMemo( () => contourData.filter( c => {
    if( kind === 'basic' && c.svgData ) return false
    if( kind === 'custom' && !c.svgData ) return false

    return true
  } ), [contourData, kind] )

  function handleDelete( contour )
  {
    if( !confirm( `Delete ${contour.name}? This will fail if it's still referenced by a substrate product.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteContour( contour.id )
        toast.success( 'Contour deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the contour - it may still be in use' )
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'name', {
        header: 'Contour',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <ContourThumbnail thumbnail={row.original.thumbnail} />
            <Typography component={Link} href={`/contours/${row.original.id}`} className='font-medium' color='text.primary'>
              {row.original.name}
            </Typography>
          </div>
        )
      } ),
      columnHelper.accessor( c => (c.svgData ? 'custom' : 'basic'), {
        id: 'kind',
        header: 'Type',
        cell: ({ row }) => (
          <Chip
            label={row.original.svgData ? 'Custom' : (row.original.shapeType || 'Basic Shape')}
            variant='tonal'
            color={row.original.svgData ? 'primary' : 'secondary'}
            size='small'
            className='capitalize'
          />
        )
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' component={Link} href={`/contours/${row.original.id}/edit`}>
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
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='kind-select'>Type</InputLabel>
              <Select labelId='kind-select' label='Type' value={kind} onChange={e => updateView( {filters: {...view.filters, kind: e.target.value}} )}>
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='basic'>Basic Shape</MenuItem>
                <MenuItem value='custom'>Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <TextField
          size='small'
          value={view.globalFilter ?? ''}
          onChange={e => updateView( {globalFilter: e.target.value} )}
          placeholder='Search Contours'
          className='max-sm:is-full'
        />
        <Button
          variant='contained'
          component={Link}
          href='/contours/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New Contour
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
                  No contours found
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
