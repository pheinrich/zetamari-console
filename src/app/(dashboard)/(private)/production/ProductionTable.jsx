'use client'

import { useMemo, useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import { rankItem } from '@tanstack/match-sorter-utils'

import { advancePieces, revertPieces } from '@/db/actions/piece'
import { useTableViewState } from '@/hooks/useTableViewState'
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import { customerDisplayName } from '../customers/customerFormat'
import tableStyles from './ProductionTable.module.css'

// CONTEXT.md's Production Phase order - every Piece.phase ENUM value,
// regardless of whether a given piece's own sequence (kit vs finished,
// see pieceScheduling.js's PHASE_SEQUENCES) actually passes through all
// of them. Glass will almost always be empty (advancePieces() auto-
// skips it whenever its duration is 0), but still shown for the rare
// piece actually sitting there with real hand-cut time pending.
const PHASE_ORDER = ['Design', 'CNC', 'Sanding', 'Picking', 'Gluing', 'Grouting', 'Glass', 'Finishing']

const DEFAULT_VIEW = {
  activeTab: null, // null = "auto-pick the first non-empty phase" (see activePhase below)
  globalFilter: '',
  filters: {
    orderDateFrom: '', orderDateTo: '',
    status: 'all',
    groutingDateFrom: '', groutingDateTo: '',
    shipDateFrom: '', shipDateTo: '',
  },
}

// Matches the wizard-examples/property-listing reference's vertical
// Stepper treatment exactly (see StepperWrapper's own .MuiStepConnector-
// root rule, which this lengthens) - phase-to-phase connectors read as
// too short at this component's default spacing otherwise.
const ConnectorHeight = styled( StepConnector )( () => ({
  '& .MuiStepConnector-line': {
    minHeight: 20,
  },
}) )

// Committed (Explicit origin) gets a solid/filled marker, Projected
// (Computed origin) a hollow/outline one - deliberately not text, so the
// date columns stay narrow instead of widening for a Chip's label.
function originMarker( origin )
{
  if( 'explicit' === origin )
    return {icon: 'ri-checkbox-circle-fill', className: 'text-success', label: 'Committed'}
  if( 'computed' === origin )
    return {icon: 'ri-time-line', className: 'text-textSecondary', label: 'Projected'}

  return null
}

function inRange( dateStr, from, to )
{
  if( !dateStr )
    return !from && !to

  if( from && dateStr < from )
    return false
  if( to && dateStr > to )
    return false

  return true
}

function DateCell( {date, origin} )
{
  const marker = date ? originMarker( origin ) : null

  return (
    <div className='flex items-center gap-1'>
      <Typography variant='body2'>{date || '—'}</Typography>
      {marker && (
        <Tooltip title={marker.label}>
          <i className={`${marker.icon} ${marker.className}`} />
        </Tooltip>
      )}
    </div>
  )
}

// Small solid/round action button - IconButton alone (this template's
// only styling hook is a hover-state tint, see @core/theme/overrides/
// icon-button.js) reads as bare and easy to miss at this table's
// density, so this forces a filled circular button via sx instead.
function ActionButton( {icon, color, onClick, disabled, title} )
{
  return (
    <IconButton
      size='small'
      onClick={onClick}
      disabled={disabled}
      title={title}
      sx={{
        bgcolor: `${color}.main`,
        color: `${color}.contrastText`,
        '&:hover': {bgcolor: `${color}.dark`},
        '&.Mui-disabled': {bgcolor: 'action.disabledBackground', color: 'action.disabled'},
      }}
    >
      <i className={icon} style={{fontSize: '1rem'}} />
    </IconButton>
  )
}

export default function ProductionTable( {pieces} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedByPhase, setSelectedByPhase] = useState( {} )
  const { view, updateView } = useTableViewState( 'production', DEFAULT_VIEW )

  const filters = {...DEFAULT_VIEW.filters, ...view.filters}

  function updateFilters( partial )
  {
    updateView( {filters: {...filters, ...partial}} )
  }

  const filteredPieces = useMemo( () => {
    const search = view.globalFilter?.trim()

    return pieces.filter( piece => {
      const order = piece.Order

      if( 'all' !== filters.status && order.status !== filters.status )
        return false

      if( !inRange( order.createdOn, filters.orderDateFrom, filters.orderDateTo ) )
        return false

      if( !inRange( order.GroutingDay?.date ?? null, filters.groutingDateFrom, filters.groutingDateTo ) )
        return false

      if( !inRange( order.promisedDate, filters.shipDateFrom, filters.shipDateTo ) )
        return false

      if( search )
      {
        const haystack = [
          piece.Product?.name,
          piece.Product?.sku,
          customerDisplayName( order.Customer ),
          order.Customer?.company,
        ].filter( Boolean ).join( ' ' )

        if( !rankItem( haystack, search ).passed )
          return false
      }

      return true
    } )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces, view.globalFilter, filters.status, filters.orderDateFrom, filters.orderDateTo,
      filters.groutingDateFrom, filters.groutingDateTo, filters.shipDateFrom, filters.shipDateTo] )

  const piecesByPhase = useMemo( () => {
    const grouped = Object.fromEntries( PHASE_ORDER.map( phase => [phase, []] ) )

    for( const piece of filteredPieces )
      grouped[piece.phase]?.push( piece )

    // Ship-date soonest-first - the point of this screen is "what
    // should I work on," and urgency beats arrival order.
    for( const phase of PHASE_ORDER )
      grouped[phase].sort( (a, b) => (a.Order.promisedDate ?? '').localeCompare( b.Order.promisedDate ?? '' ) )

    return grouped
  }, [filteredPieces] )

  const activePhase = view.activeTab && PHASE_ORDER.includes( view.activeTab )
    ? view.activeTab
    : PHASE_ORDER.find( phase => piecesByPhase[phase].length > 0 ) ?? PHASE_ORDER[0]

  const activeIndex = PHASE_ORDER.indexOf( activePhase )
  const rows = piecesByPhase[activePhase]
  const selected = selectedByPhase[activePhase] ?? new Set()

  function toggle( pieceId )
  {
    setSelectedByPhase( prev => {
      const current = new Set( prev[activePhase] ?? [] )

      if( current.has( pieceId ) )
        current.delete( pieceId )
      else
        current.add( pieceId )

      return {...prev, [activePhase]: current}
    } )
  }

  function clearSelection()
  {
    setSelectedByPhase( prev => ({...prev, [activePhase]: new Set()}) )
  }

  function advance( pieceIds )
  {
    if( !pieceIds.length )
      return

    startTransition( async () => {
      try
      {
        const result = await advancePieces( pieceIds )

        if( result?.advanced )
          toast.success( `Advanced ${result.advanced} piece${1 === result.advanced ? '' : 's'}` )
        else
          toast.info( 'Nothing to advance - already at the last phase' )

        clearSelection()
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to advance' )
      }
    } )
  }

  function revert( pieceIds )
  {
    if( !pieceIds.length )
      return

    startTransition( async () => {
      try
      {
        const result = await revertPieces( pieceIds )

        if( result?.reverted )
          toast.success( `Reverted ${result.reverted} piece${1 === result.reverted ? '' : 's'}` )
        else
          toast.info( 'Nothing to revert - already at the first phase' )

        clearSelection()
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to revert' )
      }
    } )
  }

  return (
    <Card>
      <CardHeader title='Production' subheader='Filter and advance Pieces through their production phases' />
      <CardContent className='flex flex-wrap items-end gap-4'>
        <TextField
          size='small'
          label='Search'
          placeholder='Product, SKU, customer, company'
          value={view.globalFilter ?? ''}
          onChange={e => updateView( {globalFilter: e.target.value} )}
        />
        <TextField
          size='small'
          type='date'
          label='Order From'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.orderDateFrom}
          onChange={e => updateFilters( {orderDateFrom: e.target.value} )}
        />
        <TextField
          size='small'
          type='date'
          label='Order To'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.orderDateTo}
          onChange={e => updateFilters( {orderDateTo: e.target.value} )}
        />
        <FormControl size='small' className='min-is-[10rem]'>
          <InputLabel id='production-status-filter'>Status</InputLabel>
          <Select
            labelId='production-status-filter'
            label='Status'
            value={filters.status}
            onChange={e => updateFilters( {status: e.target.value} )}
          >
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='new'>New</MenuItem>
            <MenuItem value='in-progress'>In Progress</MenuItem>
            <MenuItem value='shipped'>Shipped</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size='small'
          type='date'
          label='Grouting From'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.groutingDateFrom}
          onChange={e => updateFilters( {groutingDateFrom: e.target.value} )}
        />
        <TextField
          size='small'
          type='date'
          label='Grouting To'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.groutingDateTo}
          onChange={e => updateFilters( {groutingDateTo: e.target.value} )}
        />
        <TextField
          size='small'
          type='date'
          label='Ship From'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.shipDateFrom}
          onChange={e => updateFilters( {shipDateFrom: e.target.value} )}
        />
        <TextField
          size='small'
          type='date'
          label='Ship To'
          slotProps={{inputLabel: {shrink: true}}}
          value={filters.shipDateTo}
          onChange={e => updateFilters( {shipDateTo: e.target.value} )}
        />
      </CardContent>
      <Divider />

      <div className='flex flex-col lg:flex-row'>
        <CardContent className='max-lg:border-be lg:border-ie lg:min-is-[220px]'>
          <StepperWrapper className='bs-full'>
            <Stepper activeStep={activeIndex} connector={<ConnectorHeight />} orientation='vertical'>
              {PHASE_ORDER.map( phase => (
                <Step key={phase} onClick={() => updateView( {activeTab: phase} )}>
                  <StepLabel className='p-0' slots={{stepIcon: StepperCustomDot}}>
                    <div className='flex items-center justify-between gap-3 is-full cursor-pointer'>
                      <Typography className='step-title' color='text.primary'>{phase}</Typography>
                      <Chip label={piecesByPhase[phase].length} variant='tonal' size='small' />
                    </div>
                  </StepLabel>
                </Step>
              ) )}
            </Stepper>
          </StepperWrapper>
        </CardContent>

        <CardContent className='flex-1 flex flex-col gap-3 !pbs-5'>
          <div className='flex items-center justify-between'>
            <Button
              variant='contained'
              color='secondary'
              size='small'
              startIcon={<i className='ri-arrow-left-line' />}
              disabled={isPending || 0 === selected.size}
              onClick={() => revert( [...selected] )}
            >
              Revert Selected {selected.size > 0 ? `(${selected.size})` : ''}
            </Button>
            <Button
              variant='contained'
              size='small'
              endIcon={<i className='ri-arrow-right-line' />}
              disabled={isPending || 0 === selected.size}
              onClick={() => advance( [...selected] )}
            >
              Advance Selected {selected.size > 0 ? `(${selected.size})` : ''}
            </Button>
          </div>

          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th />
                  <th>Product</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Grouting</th>
                  <th>Ship</th>
                  <th />
                </tr>
              </thead>
              {0 === rows.length ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className='text-center'>No pieces</td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {rows.map( piece => (
                    <tr key={piece.id}>
                      <td>
                        <Checkbox
                          size='small'
                          checked={selected.has( piece.id )}
                          onChange={() => toggle( piece.id )}
                          disabled={isPending}
                        />
                      </td>
                      <td>
                        <Typography variant='body2' noWrap>{piece.Product?.name}</Typography>
                      </td>
                      <td>
                        <Link href={`/orders/${piece.Order?.id}`}>#{piece.Order?.id}</Link>
                      </td>
                      <td>
                        <Typography variant='body2' noWrap>{customerDisplayName( piece.Order?.Customer )}</Typography>
                      </td>
                      <td>
                        <DateCell date={piece.Order?.GroutingDay?.date} origin={piece.Order?.GroutingDay?.origin} />
                      </td>
                      <td>
                        <DateCell date={piece.Order?.promisedDate} origin={piece.Order?.promisedDateOrigin} />
                      </td>
                      <td>
                        <div className='flex items-center gap-1'>
                          <ActionButton
                            icon='ri-arrow-left-line'
                            color='secondary'
                            onClick={() => revert( [piece.id] )}
                            disabled={isPending}
                            title='Revert'
                          />
                          <ActionButton
                            icon='ri-arrow-right-line'
                            color='primary'
                            onClick={() => advance( [piece.id] )}
                            disabled={isPending}
                            title='Advance'
                          />
                        </div>
                      </td>
                    </tr>
                  ) )}
                </tbody>
              )}
            </table>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
