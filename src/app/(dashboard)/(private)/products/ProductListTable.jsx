'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
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

import ProductTableFilters from './ProductTableFilters'
import { productTypeMeta } from './ProductTypeMeta'
import { formatCurrency } from './productFormat'
import { deleteProduct, toggleProductSellable, toggleProductStatus } from '@/db/actions/product'
import { useTableViewState } from '@/hooks/useTableViewState'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

import tableStyles from '@core/styles/table.module.css'

const DEFAULT_VIEW = {
  sorting: [],
  pagination: {pageIndex: 0, pageSize: 10},
  globalFilter: '',
  filters: {type: '', sellable: '', status: '', supplier: ''},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )
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

export default function ProductListTable( {productData, supplierData=[]} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState( productData )
  const [filteredData, setFilteredData] = useState( productData )
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'products', DEFAULT_VIEW )

  useEffect( () => { setData( productData ) }, [productData] )

  function handleToggleSellable( product )
  {
    const next = !product.sellable

    // Optimistic update so the switch doesn't feel laggy - reconciled by
    // router.refresh() once the write completes.
    setData( prev => prev.map( p => p.id === product.id ? {...p, sellable: next} : p ) )

    startTransition( async () => {
      try
      {
        await toggleProductSellable( product.id, next )
        router.refresh()
      }
      catch( err )
      {
        setData( prev => prev.map( p => p.id === product.id ? {...p, sellable: product.sellable} : p ) )
        toast.error( 'Failed to update sellable status' )
      }
    })
  }

  function handleToggleStatus( product )
  {
    const nextVisible = product.status !== 'visible'
    const next = nextVisible ? 'visible' : 'hidden'

    // Optimistic update, same pattern as handleToggleSellable above.
    setData( prev => prev.map( p => p.id === product.id ? {...p, status: next} : p ) )

    startTransition( async () => {
      try
      {
        await toggleProductStatus( product.id, nextVisible )
        router.refresh()
      }
      catch( err )
      {
        setData( prev => prev.map( p => p.id === product.id ? {...p, status: product.status} : p ) )
        toast.error( 'Failed to update status' )
      }
    })
  }

  function handleDelete( product )
  {
    if( !confirm( `Delete ${product.name}? This is blocked if it's still used as a material in another product.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteProduct( product.id )
        toast.success( 'Product deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the product - it may still be used as a material elsewhere' )
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor( 'name', {
        header: 'Product',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original.primaryImage?.url ? (
              <img
                src={row.original.primaryImage.url}
                alt={row.original.primaryImage.altText || row.original.name}
                width={38}
                height={38}
                className='rounded bg-actionHover object-cover'
              />
            ) : (
              <CustomAvatar skin='light' color={productTypeMeta( row.original.type ).color} size={38} variant='rounded'>
                <i className={classnames( productTypeMeta( row.original.type ).icon, 'text-lg' )} />
              </CustomAvatar>
            )}
            <div className='flex flex-col'>
              <Typography component={Link} href={`/products/${row.original.id}`} className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
              <Typography variant='body2'>{row.original.sku}</Typography>
            </div>
          </div>
        )
      } ),
      columnHelper.accessor( 'type', {
        header: 'Type',
        cell: ({ row }) => {
          const meta = productTypeMeta( row.original.type )
          return (
            <div className='flex items-center gap-4'>
              <CustomAvatar skin='light' color={meta.color} size={30}>
                <i className={classnames( meta.icon, 'text-lg' )} />
              </CustomAvatar>
              <Typography color='text.primary'>{meta.label}</Typography>
            </div>
          )
        }
      } ),
      columnHelper.accessor( 'sellable', {
        header: 'Sellable',
        cell: ({ row }) => (
          <Switch
            checked={!!row.original.sellable}
            disabled={isPending}
            onChange={() => handleToggleSellable( row.original )}
          />
        ),
        enableSorting: false
      } ),
      columnHelper.accessor( 'status', {
        header: 'Visible',
        cell: ({ row }) => (
          <Switch
            checked={row.original.status !== 'hidden'}
            disabled={isPending}
            onChange={() => handleToggleStatus( row.original )}
          />
        ),
        enableSorting: false
      } ),
      columnHelper.accessor( 'priceWholesale', {
        header: 'Wholesale',
        cell: ({ row }) => <Typography>{formatCurrency( row.original.priceWholesale )}</Typography>
      } ),
      columnHelper.accessor( 'priceRetail', {
        header: 'Retail',
        cell: ({ row }) => <Typography>{formatCurrency( row.original.priceRetail )}</Typography>
      } ),
      columnHelper.accessor( 'actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' component={Link} href={`/products/${row.original.id}/edit`}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'View',
                  icon: 'ri-eye-line',
                  href: `/products/${row.original.id}`,
                  // OptionMenu (@core/components/option-menu) forces the
                  // MenuItem itself to className='p-0' whenever `href` is
                  // set (it overwrites menuItemProps.className, so a
                  // gap-2/padding class there is silently dropped) - the
                  // spacing has to live on the inner Link wrapper instead,
                  // via linkProps. Same fix as InvoiceListTable.jsx/
                  // OrderListTable.jsx elsewhere in this app.
                  linkProps: {className: 'flex items-center is-full gap-2 plb-2 pli-4'},
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => handleDelete( row.original )
                  }
                },
              ]}
            />
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
      <ProductTableFilters
        productData={data}
        supplierData={supplierData}
        setData={setFilteredData}
        filters={view.filters}
        onFiltersChange={filters => updateView( {filters} )}
      />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <DebouncedInput
          value={view.globalFilter ?? ''}
          onChange={value => updateView( {globalFilter: String( value )} )}
          placeholder='Search Products'
          className='max-sm:is-full'
        />
        <Button
          variant='contained'
          component={Link}
          href='/products/new'
          startIcon={<i className='ri-add-line' />}
          className='max-sm:is-full is-auto'
        >
          New Product
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
                  No products found
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
