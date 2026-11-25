'use client'

import { Fragment, useMemo, useState } from 'react'

import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import { formatCurrency } from '../productFormat'
import { CONFIGURATIONS, formatPiecesPerSheet } from '../../calculator/configurationCost'

// Match the Visualizer's configurationCost constants
const PRICING_ROWS = [
  { section: 'Material', key: 'woodenBase' },
  { section: 'Material', key: 'mirrorGlass' },
  { section: 'Material', key: 'tesserae' },
  { section: 'Material', key: 'grout' },
  { section: 'Breakage', key: 'sheetBreakageWood', label: 'Wood' },
  { section: 'Breakage', key: 'sheetBreakageGlass', label: 'Glass' },
  { section: 'Machine', key: 'machineWear' },
  { section: 'Machine', key: 'utilities' },
  { section: 'Labor', key: 'laborDesign', label: 'Design' },
  { section: 'Labor', key: 'laborCnc', label: 'CNC' },
  { section: 'Labor', key: 'laborSanding', label: 'Sanding' },
  { section: 'Labor', key: 'laborGluing', label: 'Gluing' },
  { section: 'Labor', key: 'laborGrouting', label: 'Grouting' },
  { section: 'Labor', key: 'laborGlass', label: 'Glass Cutting' },
  { section: 'Labor', key: 'laborAssembly', label: 'Assembly' },
  { section: 'Labor', key: 'laborFinishing', label: 'Finishing' },
]

const PRICING_SECTIONS = ['Material', 'Breakage', 'Machine', 'Labor']

// These two rows' Quantity column shows the piece count behind their
// dollar figure (see the `pieceCount` field productCost.js's
// readProductCosts() now attaches to them), same as the Visualizer's
// Pricing tab (StatsSummary.jsx/configurationCost.js) - not the dollar
// quantity every other row's Quantity column edits directly. Unlike the
// Visualizer's hypothetical shape, though, this piece count already has a
// real, editable field on this same page for a real 'wooden base'-type
// product (WoodenBaseInfo.piecesPerSheet/glassPiecesPerSheet, lifted to
// ProductForm and passed down as piecesPerSheet/glassPiecesPerSheet - see
// PIECE_COUNT_FIELDS below), so editing it here just edits that same
// value rather than an ephemeral what-if override; the $ columns this
// component recomputes from it are still last-computed-at-load, refreshed
// like every other computed figure on this form once the product is
// actually saved. The COGS/Wholesale/Retail columns stay fully editable
// as ephemeral what-ifs regardless, and, as in the Visualizer, bypass the
// piece count entirely when edited (see computeUnitRates below - it works
// identically for every row regardless of category).
const SHEET_BREAKAGE_KEYS = new Set( ['sheetBreakageWood', 'sheetBreakageGlass'] )

const PRICING_COLUMNS = [
  { key: 'cogs', label: 'COGS' },
  { key: 'wholesale', label: 'Wholesale' },
  { key: 'retail', label: 'Retail' },
]

// Same preset list as the Visualizer's Pricing tab (StatsSummary.jsx) -
// All/None plus every named CONFIGURATIONS bundle (Wooden Base/Mirror
// Glass/Tesserae/Substrate/Kit/Finished Mirror).
const INCLUDE_PRESETS = [
  { key: 'all', label: 'All' },
  { key: 'none', label: 'None' },
  ...CONFIGURATIONS.map( c => ({ key: c.key, label: c.label }) ),
]

// Mirrors StatsSummary.jsx's presetInclude() - 'all'/'none' are special-
// cased; anything else is looked up in CONFIGURATIONS for that bundle's
// factor-key membership.
function presetInclude( presetKey )
{
  if( 'all' === presetKey )
    return Object.fromEntries( PRICING_ROWS.map( r => [r.key, true] ) )
  if( 'none' === presetKey )
    return Object.fromEntries( PRICING_ROWS.map( r => [r.key, false] ) )

  const config = CONFIGURATIONS.find( c => c.key === presetKey )
  const factorKeys = new Set( config?.factorKeys ?? [] )

  return Object.fromEntries( PRICING_ROWS.map( r => [r.key, factorKeys.has( r.key )] ) )
}

// Every one of a row's cogsCost/wholesaleCost/retailCost figures is a
// straight linear function of its quantity (no additive constant - see
// configurationCost.js's computeUnitRates, which this mirrors), so the
// $/quantity-unit slope for each column can be read straight off the
// server's own baseline figures by dividing, without re-deriving the
// Material/Machine-vs-Labor rate math client-side. `data.effectiveQuantity`
// already reflects any real, persisted ProductCostOverride, so the slope
// stays correct even for an already-overridden product.
//
// If the baseline quantity is exactly zero, dividing can't recover the
// slope (0/0) - Material/Machine rows fall back to the factor's raw rate
// (`cogsRate`, already $/unit - only Labor factors ever have a rateUnit
// that differs from their unit, per libs/costFactors.js's
// convertToRateUnit). Labor rows have no such direct fallback (`cogsRate`
// is null - recovering it needs the shop's Owner/Assistant labor rates,
// which this component never receives), so a $-column edit on a zero-
// quantity Labor row is silently ignored, same as the Visualizer does for
// any zero-rate factor (see impliedQuantityFromColumn).
function computeUnitRates( data, costs )
{
  const baseQuantity = data.effectiveQuantity

  if( baseQuantity )
  {
    return {
      cogs: data.cogsCost / baseQuantity,
      wholesale: data.wholesaleCost / baseQuantity,
      retail: data.retailCost / baseQuantity,
    }
  }

  if( null != data.cogsRate )
  {
    const markupFactor = 1 + (costs.markupPercent ?? 25) / 100
    const retailMultiplier = costs.retailMultiplier ?? 1
    const cogs = data.cogsRate
    const wholesale = cogs * markupFactor

    return { cogs, wholesale, retail: wholesale * retailMultiplier }
  }

  return { cogs: 0, wholesale: 0, retail: 0 }
}

// Reproduces libs/costFactors.js's own Sheet Breakage (Wood)/(Glass)
// formula - `inputs` (sheetCost/area/ratePerSqIn) comes straight from
// productCost.js's readProductCosts() (costs.sheetBreakageInputs), which
// derives them the exact same way that formula does, so this always
// reproduces the same dollar figure the server would for the same piece
// count - editing the piece count can therefore update COGS/Wholesale/
// Retail immediately, the same way every other row's Quantity edit
// already does, without needing a full round trip.
function computeSheetBreakageDollar( pieces, inputs )
{
  if( !inputs || !(pieces > 0) || !(inputs.sheetCost > 0) )
    return 0

  return Math.max( 0, inputs.sheetCost / pieces - inputs.area * inputs.ratePerSqIn )
}

// Editable cell component matching the Visualizer's interface
function EditableQuantityCell( {value, computedValue, overridden, formatValue, onCommit, onRevert} )
{
  const [editing, setEditing] = useState( false )
  const [draft, setDraft] = useState( '' )

  function startEditing()
  {
    setDraft( null == value ? '' : String( Math.round( value * 100 ) / 100 ) )
    setEditing( true )
  }

  function commit()
  {
    const parsed = Number( draft )

    if( '' === draft.trim() || !Number.isFinite( parsed ) )
    {
      setEditing( false )
      return
    }

    // Landing back on the computed default (rounded the same way the
    // field itself displays it) reverts any existing override instead of
    // recording one that matches anyway - so a plain click-then-blur with
    // no real edit, or typing back the original value, never marks the
    // row "changed".
    const roundedParsed = Math.round( parsed * 100 ) / 100
    const roundedComputed = Math.round( (computedValue ?? 0) * 100 ) / 100

    if( roundedParsed === roundedComputed )
      onRevert()
    else
      onCommit( parsed )

    setEditing( false )
  }

  function handleKeyDown( evt )
  {
    if( 'Enter' === evt.key )
    {
      // This cell lives inside the product edit <form> - without this,
      // Enter also triggers the browser's default "submit the form" for a
      // single-line text input, which navigates away before the commit
      // above is ever visible and looks exactly like the edit reverting.
      evt.preventDefault()
      commit()
    }
    if( 'Escape' === evt.key )
      setEditing( false )
  }

  if( editing )
    return (
      <TableCell align='right'>
        <Stack direction='row' spacing={0.5} justifyContent='flex-end' alignItems='center'>
          <IconButton
            size='small'
            onMouseDown={evt => evt.preventDefault()}
            onClick={() => { onRevert(); setEditing( false ) }}
            title='Revert to computed value'
          >
            <i className='ri-close-line' style={{fontSize: '1rem'}} />
          </IconButton>
          <TextField
            autoFocus
            size='small'
            variant='standard'
            value={draft}
            onChange={evt => setDraft( evt.target.value )}
            onFocus={evt => evt.target.select()}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            sx={{width: 80}}
            slotProps={{htmlInput: {style: {textAlign: 'right'}}}}
          />
        </Stack>
      </TableCell>
    )

  return (
    <Tooltip title={overridden ? `Computed: ${formatValue( computedValue )}` : ''}>
      <TableCell
        align='right'
        onClick={startEditing}
        sx={{cursor: 'text', color: overridden ? 'warning.main' : undefined, fontWeight: overridden ? 600 : undefined}}
      >
        {formatValue( value )}
      </TableCell>
    </Tooltip>
  )
}

// Sum totals for a set of rows
function sumRows( rows, rowsByKey, include )
{
  const totals = { cogs: 0, wholesale: 0, retail: 0 }

  for( const row of rows )
  {
    const data = rowsByKey[row.key]

    if( !data || !include[row.key] )
      continue

    totals.cogs += data.cogsCost
    totals.wholesale += data.wholesaleCost
    totals.retail += data.retailCost
  }

  return totals
}

export default function ProductCostBreakdown( {
  productId, costs,
  piecesPerSheetEditable, piecesPerSheet, onPiecesPerSheetChange, glassPiecesPerSheet, onGlassPiecesPerSheetChange,
} )
{
  const [preset, setPreset] = useState( 'all' )
  const [include, setInclude] = useState( () => presetInclude( 'all' ) )
  const [expandedSections, setExpandedSections] = useState( () =>
    Object.fromEntries( PRICING_SECTIONS.map( s => [s, true] ) )
  )

  // One what-if override per row, purely client-side/ephemeral (nothing
  // persisted here, unlike a real ProductCostOverride) - {quantity, source}
  // exactly mirrors the Visualizer Pricing tab's pricingOverrides (see
  // configurationCost.js's doc comment): whichever cell was actually
  // edited (`source`) becomes the row's single override source, entered
  // as an equivalent Quantity (a $-column edit is inverted into one via
  // that row's own unit rate - see computeUnitRates/handleCommit below),
  // and every other cell on the row recomputes from it. `source` also
  // decides which one cell shows the "changed" styling - the other three
  // display their recomputed values plain, same as the Visualizer.
  const [pricingOverrides, setPricingOverrides] = useState( {} )

  // Build a map of row data from costs
  const rowsByKey = useMemo( () => {
    if( !costs?.rows )
      return {}

    return Object.fromEntries(
      costs.rows.map( row => {
        // Extract the key from the factor - support both string keys and factor objects
        const key = row.factor?.key || row.key
        return [key, row]
      })
    )
  }, [costs] )

  // Layers pricingOverrides on top of the server's rowsByKey - every
  // consumer below (row rendering, section subtotals, grand total) reads
  // from this instead of rowsByKey directly, so a what-if edit is
  // reflected everywhere at once, the same way the Visualizer's own
  // rowsByKey (computeVisualizerStats) already has overrides baked in.
  const effectiveRowsByKey = useMemo( () => {
    const result = {}

    for( const [key, data] of Object.entries( rowsByKey ) )
    {
      const unitRates = computeUnitRates( data, costs )
      const override = pricingOverrides[key]
      const quantity = override ? override.quantity : data.effectiveQuantity
      const cogsCost = override ? quantity * unitRates.cogs : data.cogsCost
      const wholesaleCost = override ? quantity * unitRates.wholesale : data.wholesaleCost
      const retailCost = override ? quantity * unitRates.retail : data.retailCost

      result[key] = {
        ...data,
        unitRates,
        quantity,
        cogsCost,
        wholesaleCost,
        retailCost,
        // The TRUE computed default at every column - derived by applying
        // this row's own unit rates to computedQuantity, rather than
        // reusing data.cogsCost/etc (which already reflect any real,
        // persisted override) - matches what an overridden cell's tooltip
        // should compare against.
        computedCost: {
          cogs: data.computedQuantity * unitRates.cogs,
          wholesale: data.computedQuantity * unitRates.wholesale,
          retail: data.computedQuantity * unitRates.retail,
        },
        overrideSource: override?.source ?? null,
      }
    }

    return result
  }, [rowsByKey, pricingOverrides, costs] )

  function handlePresetChange( nextPreset )
  {
    setPreset( nextPreset )
    setInclude( presetInclude( nextPreset ) )
  }

  function handleIncludeChange( key, checked )
  {
    setInclude( prev => ({...prev, [key]: checked}) )
  }

  function handleToggleSection( section )
  {
    setExpandedSections( prev => ({...prev, [section]: !prev[section]}) )
  }

  // Whichever column was actually edited becomes this row's single
  // override source - a $-column edit is inverted into the equivalent
  // Quantity via that row's own unit rate (computeUnitRates above), the
  // same way configurationCost.js's impliedQuantityFromColumn works, so
  // Quantity/COGS/Wholesale/Retail always stay consistent with each
  // other. A column with no recoverable rate (a zero-quantity Labor row -
  // see computeUnitRates) can't be inverted, so that edit is silently
  // ignored, matching the Visualizer.
  function handleCommit( key, columnKey, rawValue )
  {
    const parsed = Number( rawValue )
    if( !Number.isFinite( parsed ) )
      return

    const row = effectiveRowsByKey[key]
    if( !row )
      return

    let quantity

    if( 'quantity' === columnKey )
    {
      quantity = parsed
    }
    else
    {
      const rate = row.unitRates[columnKey]
      if( !rate )
        return

      quantity = parsed / rate
    }

    setPricingOverrides( prev => ({...prev, [key]: {quantity, source: columnKey}}) )
  }

  function handleRevert( key )
  {
    setPricingOverrides( prev => {
      const next = {...prev}
      delete next[key]
      return next
    })
  }

  // The real, form-submitted WoodenBaseInfo.piecesPerSheet/
  // glassPiecesPerSheet fields (lifted to ProductForm, shared with its own
  // Wooden Base Details inputs - see the doc comment there) - not a
  // pricingOverrides entry on their own, since these aren't ephemeral
  // what-ifs, they're the actual value that gets saved.
  const PIECE_COUNT_FIELDS = {
    sheetBreakageWood: {value: piecesPerSheet, onChange: onPiecesPerSheetChange},
    sheetBreakageGlass: {value: glassPiecesPerSheet, onChange: onGlassPiecesPerSheetChange},
  }

  // Editing the piece count does two things at once: writes the real
  // field above (so it's part of what Save persists), AND - by also
  // feeding the resulting dollar figure into this row's regular
  // pricingOverrides entry, source 'quantity', exactly like every other
  // row's Quantity edit - makes COGS/Wholesale/Retail (and the section/
  // grand totals) update immediately instead of only after a reload.
  function handlePieceCountCommit( key, pieces )
  {
    const rounded = Math.round( pieces )

    PIECE_COUNT_FIELDS[key].onChange( String( rounded ) )

    const quantity = computeSheetBreakageDollar( rounded, costs.sheetBreakageInputs?.[key] )
    setPricingOverrides( prev => ({...prev, [key]: {quantity, source: 'quantity'}}) )
  }

  // Clears both halves together - the real field back to blank ("compute
  // automatically", matching its own helper text) and the $ override this
  // row's Quantity edit fed into.
  function handlePieceCountRevert( key )
  {
    PIECE_COUNT_FIELDS[key].onChange( '' )
    handleRevert( key )
  }

  const colSpan = 3 + PRICING_COLUMNS.length
  const grandTotal = sumRows( PRICING_ROWS, effectiveRowsByKey, include )

  return (
    <div className='overflow-x-auto'>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell sx={{minWidth: 130}}>
              <Select
                variant='outlined'
                size='small'
                value={preset}
                onChange={evt => handlePresetChange( evt.target.value )}
                sx={{
                  fontSize: '0.8125rem',
                  '& .MuiSelect-select': {
                    paddingInlineStart: '0.75rem !important',
                    paddingInlineEnd: '2.75rem !important',
                  },
                }}
              >
                {INCLUDE_PRESETS.map( p => <MenuItem key={p.key} value={p.key}>{p.label}</MenuItem> )}
              </Select>
            </TableCell>
            <TableCell>Factor</TableCell>
            <TableCell align='right'>Quantity</TableCell>
            {PRICING_COLUMNS.map( c => <TableCell key={c.key} align='right'>{c.label}</TableCell> )}
          </TableRow>
        </TableHead>
        <TableBody>
          {PRICING_SECTIONS.map( section => {
            const sectionRows = PRICING_ROWS.filter( r => r.section === section )
            const expanded = Boolean( expandedSections[section] )
            const totals = sumRows( sectionRows, effectiveRowsByKey, include )
            const subtotalLabel = `${section} Subtotal`

            return (
              <Fragment key={section}>
                <TableRow
                  hover
                  onClick={() => handleToggleSection( section )}
                  sx={{cursor: 'pointer', backgroundColor: 'action.hover'}}
                >
                  <TableCell colSpan={colSpan}>
                    <Typography variant='caption' fontWeight={600} sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                      <i className={expanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                      {section}
                    </Typography>
                  </TableCell>
                </TableRow>
                {expanded && sectionRows.map( row => {
                  const data = effectiveRowsByKey[row.key]
                  const label = row.label ?? data?.factor?.label ?? row.key

                  return (
                    <TableRow key={row.key}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          size='small'
                          checked={Boolean( include[row.key] )}
                          onChange={evt => handleIncludeChange( row.key, evt.target.checked )}
                        />
                      </TableCell>
                      <TableCell>{label}</TableCell>
                      {!data ? (
                        <TableCell align='right'>—</TableCell>
                      ) : SHEET_BREAKAGE_KEYS.has( row.key ) && piecesPerSheetEditable ? (
                        <EditableQuantityCell
                          value={'' !== String( PIECE_COUNT_FIELDS[row.key].value ?? '' ).trim()
                            ? Number( PIECE_COUNT_FIELDS[row.key].value )
                            : data.pieceCount}
                          computedValue={data.pieceCount}
                          overridden={'quantity' === data.overrideSource}
                          formatValue={formatPiecesPerSheet}
                          onCommit={val => handlePieceCountCommit( row.key, val )}
                          onRevert={() => handlePieceCountRevert( row.key )}
                        />
                      ) : SHEET_BREAKAGE_KEYS.has( row.key ) ? (
                        <Tooltip title="This product has no Wooden Base Details to set Pieces Per Sheet on">
                          <TableCell align='right' sx={{color: 'text.secondary'}}>
                            {formatPiecesPerSheet( data.pieceCount )}
                          </TableCell>
                        </Tooltip>
                      ) : (
                        <EditableQuantityCell
                          value={data.quantity}
                          computedValue={data.computedQuantity}
                          overridden={'quantity' === data.overrideSource}
                          formatValue={v => `${v?.toFixed?.( 3 ) ?? v} ${data.factor?.unit ?? ''}`}
                          onCommit={val => handleCommit( row.key, 'quantity', val )}
                          onRevert={() => handleRevert( row.key )}
                        />
                      )}
                      {PRICING_COLUMNS.map( c => {
                        if( !data )
                          return <TableCell key={c.key} align='right'>—</TableCell>

                        return (
                          <EditableQuantityCell
                            key={c.key}
                            value={data[`${c.key}Cost`]}
                            computedValue={data.computedCost[c.key]}
                            overridden={data.overrideSource === c.key}
                            formatValue={formatCurrency}
                            onCommit={val => handleCommit( row.key, c.key, val )}
                            onRevert={() => handleRevert( row.key )}
                          />
                        )
                      } )}
                    </TableRow>
                  )
                } )}
                <TableRow hover={false}>
                  <TableCell />
                  <TableCell>{subtotalLabel}</TableCell>
                  <TableCell />
                  {PRICING_COLUMNS.map( c => (
                    <TableCell key={c.key} align='right'>
                      {formatCurrency( totals[c.key] )}
                    </TableCell>
                  ) )}
                </TableRow>
              </Fragment>
            )
          } )}
        </TableBody>
        <TableFooter>
          <TableRow sx={{borderTop: '2px solid', borderColor: 'divider', '& .MuiTableCell-root': {paddingBlock: 1.5}}}>
            <TableCell />
            <TableCell><Typography variant='subtitle2'>Total</Typography></TableCell>
            <TableCell />
            {PRICING_COLUMNS.map( c => (
              <TableCell key={c.key} align='right'>
                <Typography variant='subtitle2'>{formatCurrency( grandTotal[c.key] )}</Typography>
              </TableCell>
            ) )}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
