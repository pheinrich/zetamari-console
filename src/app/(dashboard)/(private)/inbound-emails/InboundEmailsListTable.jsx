'use client'

import { useMemo, useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
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

import { deleteInboundEmails, reprocessInboundEmails, undoInboundEmails } from '@/db/actions/channelOrder'
import { useConfirm } from '@/contexts/confirmContext'
import { useTableViewState } from '@/hooks/useTableViewState'
import tableStyles from '@core/styles/table.module.css'
import { EMAIL_KIND_LABELS, EMAIL_STATUS_COLORS, channelLabel, dateTime, money, orderAmount } from '../channel-orders/channelOrderFormat'
import InboundEmailActions from './InboundEmailActions'

const DEFAULT_VIEW = {
  sorting: [{id: 'receivedAt', desc: true}],
  pagination: {pageIndex: 0, pageSize: 25},
  globalFilter: '',
  filters: {status: '', channel: ''},
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem( row.getValue( columnId ), value )

  addMeta( {itemRank} )

  return itemRank.passed
}

const columnHelper = createColumnHelper()

// The Channel filter's value for emails from no known channel (kind
// 'unrecognized') - not a channel name, so it can't collide with one.
const UNRECOGNIZED = '!unrecognized'

const matchesChannel = ( email, channel ) =>
  !channel || (channel === UNRECOGNIZED ? email.kind === 'unrecognized' : email.channel === channel)

// Everything POSTed to /api/inbound/order-email, order or not - see
// CONTEXT.md's Inbound Email entry.
export default function InboundEmailsListTable( {emailData} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()
  const [confirmDelete, setConfirmDelete] = useState( false )
  const [rowSelection, setRowSelection] = useState( {} )
  const { view, updateView, onSortingChange, onPaginationChange } = useTableViewState( 'inboundEmails', DEFAULT_VIEW )

  const filters = {...DEFAULT_VIEW.filters, ...view.filters}
  const channels = useMemo( () => [...new Set( emailData.map( e => e.channel ).filter( Boolean ) )].sort(), [emailData] )

  const filteredData = useMemo(
    () => emailData.filter( e => (!filters.status || e.status === filters.status) && matchesChannel( e, filters.channel ) ),
    [emailData, filters.status, filters.channel]
  )

  const plural = n => `${n} email${n === 1 ? '' : 's'}`

  // Each batch action ends the same way: clear the selection, show what
  // happened, and reload the list.
  function finishBatch( message, warning )
  {
    warning ? toast.warning( warning ) : toast.success( message )
    setRowSelection( {} )
    router.refresh()
  }

  async function handleRevert()
  {
    const message = revertable.some( e => e.channelOrderId )
      ? `Undo parsing ${plural( revertable.length )}? Their channel orders are deleted too, unless another email also feeds them.`
      : `Undo processing ${plural( revertable.length )}? They go back to "received".`

    if( !await confirm( message, {confirmText: 'Revert', destructive: true} ) )
      return

    startTransition( async () => {
      const {total, failed} = await undoInboundEmails( revertable.map( e => e.id ) )

      finishBatch(
        `Reverted ${plural( total )}`,
        failed && `Reverted ${total - failed} of ${plural( total )}; ${failed} feed a reviewed channel order`
      )
    } )
  }

  function handleRetry()
  {
    startTransition( async () => {
      const {total, failed, unchanged} = await reprocessInboundEmails( selectedIds )
      const notes = [failed && `${failed} failed`, unchanged && `${unchanged} left unchanged (channel order already reviewed)`].filter( Boolean )

      finishBatch( `Reparsed ${plural( total )}`, notes.length && `Reparsed ${plural( total )}: ${notes.join( ', ' )}` )
    } )
  }

  function handleDelete()
  {
    startTransition( async () => {
      const {total, failed} = await deleteInboundEmails( selectedIds )

      setConfirmDelete( false )
      finishBatch(
        `Deleted ${plural( total )}`,
        failed && `Deleted ${total - failed} of ${plural( total )}; ${failed} feed a reviewed channel order`
      )
    } )
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
            inputProps={{'aria-label': 'Select all emails'}}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size='small'
            checked={row.getIsSelected()}
            onClick={e => e.stopPropagation()}
            onChange={row.getToggleSelectedHandler()}
            inputProps={{'aria-label': 'Select email'}}
          />
        )
      } ),
      columnHelper.accessor( 'receivedAt', {
        header: 'Received',
        cell: ({ getValue }) => <Typography className='whitespace-nowrap'>{dateTime( getValue() )}</Typography>
      } ),
      columnHelper.accessor( o => channelLabel( o.channel ), {
        id: 'channel',
        header: 'Source',
        cell: ({ row }) => {
          const channel = row.original.channel ? channelLabel( row.original.channel ) : '—'

          return (
            <Tooltip title={<>{channel}<br />{row.original.fromAddress}</>}>
              <div className='flex flex-col max-is-[160px]'>
                <Typography noWrap>{channel}</Typography>
                <Typography noWrap variant='body2' color='text.secondary'>{row.original.fromAddress}</Typography>
              </div>
            </Tooltip>
          )
        }
      } ),
      columnHelper.accessor( 'subject', {
        header: 'Subject',
        cell: ({ row }) => (
          <div className='flex flex-col min-is-[200px] max-is-[280px] whitespace-normal break-words'>
            <Link href={`/inbound-emails/${row.original.id}`}>{row.original.subject || '(no subject)'}</Link>
            <Typography variant='body2' color='text.secondary'>{EMAIL_KIND_LABELS[row.original.kind] ?? 'Not yet processed'}</Typography>
          </div>
        )
      } ),
      columnHelper.accessor( 'status', {
        header: 'Status',
        cell: ({ row }) => {
          const chip = <Chip size='small' variant='tonal' color={EMAIL_STATUS_COLORS[row.original.status]} label={row.original.status} />

          return row.original.error ? <Tooltip title={row.original.error}>{chip}</Tooltip> : chip
        }
      } ),
      columnHelper.accessor( o => o.ChannelOrder?.externalOrderId ?? '', {
        id: 'order',
        header: 'Channel order',
        cell: ({ row }) => {
          const order = row.original.ChannelOrder

          return order
            ? (
              <div className='flex flex-col' onClick={e => e.stopPropagation()}>
                <Link href={`/channel-orders/${order.id}`}>#{order.externalOrderId}</Link>
                <Typography variant='body2' color='text.secondary'>{money( orderAmount( order ) )} · {order.status}</Typography>
              </div>
            )
            : <Typography color='text.secondary'>—</Typography>
        }
      } ),
      columnHelper.display( {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <InboundEmailActions email={row.original} compact deletable />
      } ),
    ],
    []
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

  // Selected rows still shown (a filter or search can hide some); the batch
  // buttons act on those that support their action - see InboundEmailActions.
  const selectedEmails = table.getFilteredSelectedRowModel().rows.map( r => r.original )
  const selectedIds = selectedEmails.map( e => e.id )
  const revertable = selectedEmails.filter( e => e.status !== 'received' )
  const withCount = (label, n) => n ? `${label} (${n})` : label

  return (
    <Card>
      <CardHeader title='Inbound Emails' subheader='Every email received at the order intake address' className='pbe-4' />
      <Divider />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <div className='flex flex-wrap items-center gap-4'>
          <TextField
            size='small'
            value={view.globalFilter ?? ''}
            onChange={e => updateView( {globalFilter: e.target.value} )}
            placeholder='Search Emails'
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
            {Object.keys( EMAIL_STATUS_COLORS ).map( s => <MenuItem key={s} value={s}>{s}</MenuItem> )}
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
            <MenuItem value={UNRECOGNIZED}>Unrecognized</MenuItem>
            {channels.length > 0 && <Divider />}
            {channels.map( c => <MenuItem key={c} value={c}>{channelLabel( c )}</MenuItem> )}
          </TextField>
        </div>
        <div className='flex flex-wrap gap-4 max-sm:is-full'>
          <Button
            variant='outlined'
            color='secondary'
            disabled={isPending || !revertable.length}
            onClick={handleRevert}
            startIcon={<i className='ri-arrow-go-back-line' />}
          >
            {withCount( 'Revert', revertable.length )}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            disabled={isPending || !selectedIds.length}
            onClick={handleRetry}
            startIcon={<i className='ri-refresh-line' />}
          >
            {withCount( 'Retry', selectedIds.length )}
          </Button>
          <Button
            variant='outlined'
            color='error'
            disabled={isPending || !selectedIds.length}
            onClick={() => setConfirmDelete( true )}
            startIcon={<i className='ri-delete-bin-7-line' />}
          >
            {withCount( 'Delete', selectedIds.length )}
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
                  No emails found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map( row => (
                <tr
                  key={row.id}
                  className='cursor-pointer hover:bg-actionHover'
                  onClick={() => router.push( `/inbound-emails/${row.original.id}` )}
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
      <Dialog
        fullWidth
        maxWidth='xs'
        open={confirmDelete}
        onClose={() => !isPending && setConfirmDelete( false )}
        closeAfterTransition={false}
      >
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
          <Typography variant='h4'>Delete {plural( selectedIds.length )}?</Typography>
          <Typography color='text.secondary' className='mbs-2'>
            {selectedEmails.some( e => e.channelOrderId )
              ? 'The stored emails are removed for good, along with their channel orders unless another email also feeds them.'
              : 'The stored emails are removed for good.'}
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='error' disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <Button variant='outlined' color='secondary' disabled={isPending} onClick={() => setConfirmDelete( false )}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
