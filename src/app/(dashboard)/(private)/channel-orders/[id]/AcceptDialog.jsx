'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { acceptChannelOrder, readAcceptPreview, searchCustomers } from '@/db/actions/channelOrder'
import tableStyles from '@core/styles/table.module.css'

const REASONS = {'buyer ID': 'same buyer ID', email: 'same email', channel: 'the channel', company: 'same company', name: 'same name'}

// Accepting a Channel Order into an Order (libs/channelOrders/accept.js):
// confirm the customer (preselected when the channel's buyer ID or email
// matches someone, or the channel itself is the customer), the promised
// date, and quantities where the channel sent none. Blocked, with the
// reasons, while lines are unmatched or missing.
export default function AcceptDialog( {order, open, onClose} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState( null )
  const [customer, setCustomer] = useState( null )
  const [promisedDate, setPromisedDate] = useState( '' )
  const [quantities, setQuantities] = useState( {} )
  const [search, setSearch] = useState( '' )
  const [found, setFound] = useState( [] )

  const newOption = useMemo( () => preview && ({
    id: 'new',
    label: `New customer: ${[preview.newCustomer.name, preview.newCustomer.company].filter( Boolean ).join( ' — ' ) || 'from the buyer'}`,
    email: preview.newCustomer.email,
  }), [preview] )

  useEffect( () => {
    if( !open )
      return

    setPreview( null )
    readAcceptPreview( order.id ).then( p => {
      setPreview( p )
      setPromisedDate( p.promisedDate ?? '' )
      setQuantities( {} )
      setCustomer( p.candidates.find( c => c.id === p.customerId ) ?? null )
    } )
  }, [open, order.id] )

  // Search People as the customer box is typed into
  useEffect( () => {
    if( search.trim().length < 2 )
      return setFound( [] )

    const timer = setTimeout( () => searchCustomers( search ).then( setFound ), 300 )

    return () => clearTimeout( timer )
  }, [search] )

  const options = useMemo( () => {
    if( !preview )
      return []

    const ids = new Set( preview.candidates.map( c => c.id ) )

    return [newOption, ...preview.candidates, ...found.filter( f => !ids.has( f.id ) )]
  }, [preview, found, newOption] )

  const missingQuantity = preview?.lines.some( l => l.quantity === null && !(Number( quantities[l.id] ) > 0) )
  const blocking = preview?.blocking.filter( b => !/needs a quantity/.test( b ) ) ?? []

  function submit()
  {
    startTransition( async () => {
      const result = await acceptChannelOrder( order.id, {customerId: customer.id, promisedDate, quantities} )

      if( result.error )
        return toast.error( result.error )

      toast.success( `Accepted as Order #${result.orderId}` )
      onClose()
      router.refresh()
    } )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Accept into an Order</DialogTitle>
      <DialogContent className='flex flex-col gap-5'>
        {!preview ? <div className='flex justify-center p-6'><CircularProgress /></div> : (
          <>
            {blocking.map( b => <Alert key={b} severity='warning'>{b}</Alert> )}

            <div className='flex flex-col gap-1'>
              <Autocomplete
                options={options}
                value={customer}
                onChange={(e, value) => setCustomer( value )}
                onInputChange={(e, value, reason) => reason === 'input' && setSearch( value )}
                filterOptions={x => x}
                getOptionLabel={o => o.label}
                getOptionKey={o => o.id}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderOption={({key, ...props}, o) => (
                  <li key={key} {...props}>
                    <div className='flex flex-col'>
                      <span>{o.label}{o.reason && <Chip size='small' variant='tonal' color='success' label={REASONS[o.reason]} className='mis-2' />}</span>
                      {o.email && <small className='text-textSecondary'>{o.email}</small>}
                    </div>
                  </li>
                )}
                renderInput={params => <TextField {...params} label='Customer' placeholder='Search people by name, company or email' />}
              />
              <Typography variant='body2' color='text.secondary'>
                {customer?.reason
                  ? `Matched by ${REASONS[customer.reason]}.`
                  : !customer && preview.candidates.length ? 'Possible matches are listed - or create a new customer.' : null}
                {preview.role && ` Will be marked ${preview.role}.`}
              </Typography>
            </div>

            <TextField
              type='date'
              label='Promised date'
              value={promisedDate}
              onChange={e => setPromisedDate( e.target.value )}
              helperText={`${order.requestedShipDate ? `The channel asked for: ${order.requestedShipDate}. ` : ''}Leave blank to compute it later.`}
              slotProps={{inputLabel: {shrink: true}}}
              sx={{maxInlineSize: 320}}
            />

            <table className={tableStyles.table}>
              <thead><tr><th>Product</th><th>Quantity</th><th>Pieces</th></tr></thead>
              <tbody>
                {preview.lines.map( line => (
                  <tr key={line.id}>
                    <td>{line.product ? `${line.product.name} (${line.product.sku})` : <Chip size='small' variant='tonal' color='warning' label={`unmatched: ${line.sku || line.description}`} />}</td>
                    <td>
                      {line.quantity !== null ? line.quantity : (
                        <TextField
                          size='small'
                          type='number'
                          placeholder='Qty'
                          value={quantities[line.id] ?? ''}
                          onChange={e => setQuantities( q => ({...q, [line.id]: e.target.value}) )}
                          sx={{inlineSize: 90}}
                        />
                      )}
                    </td>
                    <td>{line.makesPieces ? (line.quantity ?? quantities[line.id] ?? '—') : <Typography variant='body2' color='text.secondary'>none (not a production item)</Typography>}</td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>Cancel</Button>
        <Button variant='contained' disabled={!preview || blocking.length > 0 || missingQuantity || !customer || isPending} onClick={submit}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
