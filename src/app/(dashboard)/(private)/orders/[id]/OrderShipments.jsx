'use client'

import { useEffect, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { advanceShipment, createShipment, deleteShipment, revertShipment, updateShipment } from '@/db/actions/shipment'
import { useConfirm } from '@/contexts/confirmContext'
import tableStyles from '@core/styles/table.module.css'
import { unitInputProps } from '@/utils/units'
import {
  CARRIER_MODES, SHIPMENT_STEPS, STEP_COLORS, TRANSPORT_MODES, TRANSPORT_MODE_LABELS, addressLines,
} from '@/utils/shipments'

const ADDRESS_FIELDS = [
  ['name', 'Name'], ['company', 'Company'], ['street1', 'Street'], ['street2', 'Street (2)'],
  ['city', 'City'], ['state', 'State'], ['postalCode', 'Postal code'], ['country', 'Country'],
]

const when = at => at ? new Date( at ).toLocaleString( 'en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'} ) : null

const FULFILLMENT_TEXT = {
  shipped: 'Shipped',
  'partly shipped': 'Partly shipped',
  'in fulfillment': 'Being fulfilled',
}

// An Order's Shipments - see CONTEXT.md's Shipment entry. Each is worked
// a step at a time (Picking, Packing, Paperwork, Hand-off), with the last
// step undoable; its products change, and it can be deleted, only while
// at Picking.
export default function OrderShipments( {order} )
{
  const router = useRouter()
  const confirm = useConfirm()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState( null )   // null, 'new', or a Shipment

  const allocated = order.fulfillment.allocated
  const left = order.lines.reduce( (n, l) => n + Math.max( 0, Number( l.quantity ) - (allocated[l.productId] ?? 0) ), 0 )

  const status = [
    FULFILLMENT_TEXT[order.fulfillment.status] ?? 'Nothing shipped yet',
    order.completedOn ? `on ${order.completedOn}` : null,
    left ? `${left} ${left === 1 ? 'item' : 'items'} not on a shipment` : null,
  ].filter( Boolean ).join( ' · ' )

  // Runs a server action, then reports and refreshes
  function act( work, success )
  {
    startTransition( async () => {
      const result = await work()

      if( result.error )
        return toast.error( result.error )

      if( success )
        toast.success( typeof success === 'function' ? success( result ) : success )

      setEditing( null )
      router.refresh()
    } )
  }

  async function remove( shipment )
  {
    if( await confirm( `Delete Shipment #${shipment.id}? Its products go back to being unshipped.`, {confirmText: 'Delete', destructive: true} ) )
      act( () => deleteShipment( shipment.id ), `Deleted Shipment #${shipment.id}` )
  }

  return (
    <Card>
      <CardHeader
        title='Shipments'
        subheader={status}
        action={(
          <Button
            variant='outlined'
            disabled={isPending || !left}
            onClick={() => setEditing( 'new' )}
            startIcon={<i className='ri-add-line' />}
          >
            New shipment
          </Button>
        )}
      />
      <CardContent className='flex flex-col gap-4'>
        {!order.shipments.length && <Typography color='text.secondary'>No shipments yet</Typography>}
        {order.shipments.map( shipment => (
          <ShipmentPanel
            key={shipment.id}
            shipment={shipment}
            disabled={isPending}
            onAdvance={() => act( () => advanceShipment( shipment.id ), r => `Shipment #${shipment.id}: ${r.step} done` )}
            onRevert={() => act( () => revertShipment( shipment.id ), r => `Shipment #${shipment.id}: back to ${r.step}` )}
            onEdit={() => setEditing( shipment )}
            onDelete={() => remove( shipment )}
          />
        ) )}
      </CardContent>
      <ShipmentDialog
        open={editing !== null}
        order={order}
        shipment={editing === 'new' ? null : editing}
        disabled={isPending}
        onClose={() => setEditing( null )}
        onSave={fields => editing === 'new'
          ? act( () => createShipment( order.id, fields ), r => `Created Shipment #${r.shipmentId}` )
          : act( () => updateShipment( editing.id, fields ), `Updated Shipment #${editing.id}` )}
      />
    </Card>
  )
}

function ShipmentPanel( {shipment, disabled, onAdvance, onRevert, onEdit, onDelete} )
{
  const index = SHIPMENT_STEPS.findIndex( s => s.step === shipment.step )
  const next = SHIPMENT_STEPS[index]
  const last = SHIPMENT_STEPS.filter( s => shipment[s.doneAt] ).at( -1 )
  const shipTo = addressLines( shipment.shipTo )
  const carrier = [shipment.carrier, shipment.service].filter( Boolean ).join( ' · ' )

  return (
    <div id={`shipment-${shipment.id}`} className='flex flex-col gap-3 rounded border border-solid border-divider p-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <Typography variant='h6'>Shipment #{shipment.id}</Typography>
          <Chip size='small' variant='tonal' color={STEP_COLORS[shipment.step]} label={shipment.step === 'Done' ? 'Handed off' : shipment.step} />
          {shipment.transportMode && <Chip size='small' variant='outlined' label={TRANSPORT_MODE_LABELS[shipment.transportMode]} />}
        </div>
        <div className='flex items-center gap-1'>
          {next && (
            <Button size='small' variant='contained' disabled={disabled} onClick={onAdvance}>
              Mark {next.action.toLowerCase()}
            </Button>
          )}
          {last && (
            <Tooltip title={`Undo ${last.step}`}>
              <span>
                <IconButton size='small' disabled={disabled} onClick={onRevert}>
                  <i className='ri-arrow-go-back-line text-[22px] text-textSecondary' />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title='Edit'>
            <span>
              <IconButton size='small' disabled={disabled} onClick={onEdit}>
                <i className='ri-edit-box-line text-[22px] text-textSecondary' />
              </IconButton>
            </span>
          </Tooltip>
          {!shipment.pickedAt && (
            <Tooltip title='Delete'>
              <span>
                <IconButton size='small' disabled={disabled} onClick={onDelete}>
                  <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Pieces</th></tr>
          </thead>
          <tbody>
            {shipment.Lines.map( line => (
              <tr key={line.id}>
                <td className='whitespace-normal'>
                  <Typography component='span'>{line.Product?.name}</Typography>{' '}
                  <Typography component='span' variant='body2' color='text.secondary'>{line.Product?.sku}</Typography>
                </td>
                <td>{line.quantity} {line.Product?.units && line.Product.units !== 'each' ? line.Product.units : ''}</td>
                <td>
                  {line.makesPieces
                    ? <Chip size='small' variant='tonal' color={line.ready >= line.quantity ? 'success' : 'warning'} label={`${line.ready} of ${line.quantity} ready`} />
                    : <Typography variant='body2' color='text.secondary'>From stock</Typography>}
                </td>
              </tr>
            ) )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap gap-x-10 gap-y-3'>
        <div className='flex flex-col'>
          <Typography variant='body2' color='text.secondary'>Ship to</Typography>
          {shipTo.length ? shipTo.map( (line, i) => <Typography key={i}>{line}</Typography> ) : <Typography>—</Typography>}
        </div>
        {CARRIER_MODES.has( shipment.transportMode ) && (
          <div className='flex flex-col'>
            <Typography variant='body2' color='text.secondary'>Carrier</Typography>
            <Typography>{carrier || '—'}</Typography>
            {shipment.tracking && <Typography>Tracking {shipment.tracking}</Typography>}
          </div>
        )}
        <div className='flex flex-col'>
          <Typography variant='body2' color='text.secondary'>Progress</Typography>
          {SHIPMENT_STEPS.filter( s => shipment[s.doneAt] ).map( s => (
            <Typography key={s.step}>{s.action} {when( shipment[s.doneAt] )}</Typography>
          ) )}
          {!shipment.pickedAt && <Typography>Created {shipment.createdOn}</Typography>}
        </div>
        {shipment.notes && (
          <div className='flex flex-col max-is-[480px]'>
            <Typography variant='body2' color='text.secondary'>Notes</Typography>
            <Typography className='whitespace-pre-wrap'>{shipment.notes}</Typography>
          </div>
        )}
      </div>
    </div>
  )
}

// Creating a Shipment (products, how it travels, notes - its ship-to and
// carrier start from the channel order or customer) or editing one (all
// of it; products only while at Picking).
function ShipmentDialog( {open, order, shipment, disabled, onClose, onSave} )
{
  const creating = !shipment
  const locked = !!shipment?.pickedAt
  const [quantities, setQuantities] = useState( {} )
  const [fields, setFields] = useState( {} )
  const [shipTo, setShipTo] = useState( {} )

  // What each product could ship on this Shipment: what's left, plus what it already carries
  const available = Object.fromEntries( order.lines.map( l => {
    const own = shipment?.Lines.find( s => s.productId === l.productId )?.quantity ?? 0

    return [l.productId, Number( l.quantity ) - (order.fulfillment.allocated[l.productId] ?? 0) + own]
  } ) )

  useEffect( () => {
    if( !open )
      return

    setQuantities( Object.fromEntries( order.lines.map( l => [
      l.productId,
      String( shipment ? (shipment.Lines.find( s => s.productId === l.productId )?.quantity ?? 0) : available[l.productId] ),
    ] ) ) )

    setFields( {
      transportMode: shipment?.transportMode ?? '',
      carrier: shipment?.carrier ?? '',
      service: shipment?.service ?? '',
      tracking: shipment?.tracking ?? '',
      notes: shipment?.notes ?? '',
    } )

    setShipTo( shipment?.shipTo ?? {} )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, shipment] )

  const set = key => e => setFields( f => ({...f, [key]: e.target.value}) )
  const lines = order.lines.map( l => ({productId: l.productId, quantity: Number( quantities[l.productId] || 0 )}) )
  const anything = lines.some( l => l.quantity > 0 )

  function save()
  {
    const out = {transportMode: fields.transportMode || null, notes: fields.notes}

    if( !locked )
      out.lines = lines.filter( l => l.quantity > 0 )

    if( !creating )
      Object.assign( out, {carrier: fields.carrier, service: fields.service, tracking: fields.tracking, shipTo} )

    onSave( out )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{creating ? 'New shipment' : `Shipment #${shipment.id}`}</DialogTitle>
      <DialogContent className='flex flex-col gap-5'>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr><th>Product</th><th>Available</th><th>Ship</th></tr>
            </thead>
            <tbody>
              {order.lines.filter( l => available[l.productId] > 0 ).map( l => (
                <tr key={l.productId}>
                  <td className='whitespace-normal'>
                    <Typography component='span'>{l.Product?.name}</Typography>{' '}
                    <Typography component='span' variant='body2' color='text.secondary'>{l.Product?.sku}</Typography>
                  </td>
                  <td>{available[l.productId]}</td>
                  <td>
                    <TextField
                      size='small'
                      type='number'
                      value={quantities[l.productId] ?? ''}
                      disabled={locked}
                      onChange={e => setQuantities( q => ({...q, [l.productId]: e.target.value}) )}
                      slotProps={{
                        htmlInput: {min: 0, max: available[l.productId], step: l.makesPieces ? 1 : 'any', 'aria-label': 'Quantity to ship'},
                        input: unitInputProps( l.Product?.units || 'each' ),
                      }}
                      sx={{inlineSize: 150}}
                    />
                  </td>
                </tr>
              ) )}
            </tbody>
          </table>
          {locked && <Typography variant='body2' color='text.secondary' className='mbs-2'>Already picked - move it back to Picking to change its products.</Typography>}
        </div>

        <TextField select size='small' label='Transport' value={fields.transportMode ?? ''} onChange={set( 'transportMode' )} className='max-is-[260px]'>
          <MenuItem value=''>Not decided yet</MenuItem>
          {TRANSPORT_MODES.map( m => <MenuItem key={m} value={m}>{TRANSPORT_MODE_LABELS[m]}</MenuItem> )}
        </TextField>

        {!creating && CARRIER_MODES.has( fields.transportMode ) && (
          <div className='flex flex-wrap gap-4'>
            <TextField size='small' label='Carrier' value={fields.carrier ?? ''} onChange={set( 'carrier' )} />
            <TextField size='small' label='Service' value={fields.service ?? ''} onChange={set( 'service' )} />
            <TextField size='small' label='Tracking number' value={fields.tracking ?? ''} onChange={set( 'tracking' )} />
          </div>
        )}

        {!creating && (
          <div className='flex flex-col gap-3'>
            <Typography variant='body2' color='text.secondary'>Ship to</Typography>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {ADDRESS_FIELDS.map( ([key, label]) => (
                <TextField key={key} size='small' label={label} value={shipTo[key] ?? ''} onChange={e => setShipTo( a => ({...a, [key]: e.target.value}) )} />
              ) )}
            </div>
          </div>
        )}

        {creating && (
          <Typography variant='body2' color='text.secondary'>
            Ship-to and carrier start from the channel order (or the customer) - edit the shipment to change them.
          </Typography>
        )}

        <TextField size='small' label='Notes' multiline minRows={2} value={fields.notes ?? ''} onChange={set( 'notes' )} />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>Cancel</Button>
        <Button variant='contained' disabled={disabled || (!locked && !anything)} onClick={save}>{creating ? 'Create' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  )
}
