'use client'

import { Fragment, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import {
  TABS,
  PRICING_COLUMNS,
  CONFIGURATIONS,
  computeVisualizerStats,
  computeAreaStats,
  impliedQuantityFromColumn,
  formatAreaFt2,
  formatAreaIn2,
  formatWeightLb,
  formatCost,
  formatMachineTime,
  formatCutDistance,
  formatQuantity,
  formatPiecesPerSheet,
  formatTBD,
} from './configurationCost'
import CreateNewProductDialog from './CreateNewProductDialog'

// --- Row/column definitions -------------------------------------------------

// Area/Weight/Packaging are all "one row, several columns" tables - a
// single ROWS + column-formatter pair, no configuration axis, per the
// 2026-08-02/2026-08-03 revisions.
const AREA_ROWS = [
  { key: 'mosaicSurface', label: 'Mosaic Surface' },
  { key: 'visibleMirror', label: 'Visible Mirror' },
  { key: 'woodenBaseObb', label: 'Minimum Rect: Wooden Base' },
  { key: 'mirrorGlassObb', label: 'Minimum Rect: Mirror Glass' },
]

const AREA_COLUMNS = [
  { key: 'sqft', label: 'sq ft', format: formatAreaFt2 },
  { key: 'sqin', label: 'sq in', format: formatAreaIn2 },
]

// Packaging (renamed from "Shipping" in the 2026-08-03 revision) - no box-
// size/shipping-weight/cost formula exists anywhere in the app yet, so
// every cell is a TBD placeholder until that exists. Rows mirror the raw-
// material/composed-bundle list used elsewhere (minus Grout, which has no
// packaging of its own).
const PACKAGING_ROWS = [
  { key: 'woodenBase', label: 'Wooden Base' },
  { key: 'mirrorGlass', label: 'Mirror Glass' },
  { key: 'tesserae', label: 'Tesserae' },
  { key: 'substrate', label: 'Substrate (Wooden Base + Mirror Glass)' },
  { key: 'kit', label: 'Kit (Wooden Base + Mirror Glass + Tesserae)' },
  { key: 'finishedMirror', label: 'Finished Mirror' },
]

const PACKAGING_COLUMNS = [
  { key: 'shippingSize', label: 'Shipping Size', format: formatTBD },
  { key: 'shippingWeight', label: 'Shipping Weight', format: formatTBD },
  { key: 'minimumBox', label: 'Minimum Box', format: formatTBD },
  { key: 'boxCost', label: 'Box Cost', format: formatTBD },
]

const PRODUCTION_ROWS = [
  { key: 'machineTime', label: 'Machine Time', get: computed => computed.runTimeMin ?? 0, format: formatMachineTime },
  { key: 'cutDistance', label: 'Cut Distance', get: computed => computed.cutDistanceIn ?? 0, format: formatCutDistance },
]

// Pricing's row list - every CostFactor except the 'bom' pass-through
// (always 0 for a hypothetical shape with no real BOM lines - nothing to
// toggle) and the two laborOwner/laborAssistant rate-holder rows (they
// have no quantity/row of their own - see configurationCost.js). `label`
// overrides the CostFactor's own DB label for the Labor rows (the section
// header already says "Labor," so repeating "Design Labor"/"CNC Labor"/etc
// on every row would be redundant) and the two Breakage rows (their own
// section header already says "Breakage," so "Wood"/"Glass" alone is
// enough); Material/Machine rows reuse the factor's real label as-is (it
// already matches this wording exactly). Sheet Breakage moved into its own
// section (below Material) per the 2026-08-19 revision - it's a piece
// count, not a dollar material cost, and keeping it out of Material lets
// the Weight tab's reused Material-section table (see MATERIAL_ROWS/
// WeightTable below) show only real, weighable materials.
const PRICING_ROWS = [
  { section: 'Material', key: 'woodenBase' },
  { section: 'Material', key: 'mirrorGlass' },
  { section: 'Material', key: 'tesserae' },
  { section: 'Material', key: 'grout' },
  { section: 'Breakage', key: 'sheetBreakageWood', label: 'Wood', pieceCount: true },
  { section: 'Breakage', key: 'sheetBreakageGlass', label: 'Glass', pieceCount: true },
  { section: 'Machine', key: 'machineWear' },
  { section: 'Machine', key: 'utilities' },
  { section: 'Labor', key: 'laborDesign', label: 'Design' },
  { section: 'Labor', key: 'laborCnc', label: 'CNC' },
  { section: 'Labor', key: 'laborSanding', label: 'Sanding' },
  { section: 'Labor', key: 'laborGluing', label: 'Gluing' },
  { section: 'Labor', key: 'laborGrouting', label: 'Grouting' },
  { section: 'Labor', key: 'laborGlass', label: 'Glass Cutting' },
  { section: 'Labor', key: 'laborPicking', label: 'Picking' },
  { section: 'Labor', key: 'laborFinishing', label: 'Finishing' },
]

const PRICING_SECTIONS = ['Material', 'Breakage', 'Machine', 'Labor']

// The Weight tab reuses this same Material section (see WeightTable
// below) rather than duplicating a row list - it's the only section
// that's ever meaningfully "weighable" (Breakage is a piece count,
// Machine/Labor have no material weight of their own).
const MATERIAL_ROWS = PRICING_ROWS.filter( r => 'Material' === r.section )

// The Include column header's preset dropdown - bulk-sets every row's
// checkbox at once. 'all'/'none' are special-cased; anything else is
// looked up in CONFIGURATIONS for that bundle's factor-key membership.
const INCLUDE_PRESETS = [
  { key: 'all', label: 'All' },
  { key: 'none', label: 'None' },
  ...CONFIGURATIONS.map( c => ({ key: c.key, label: c.label }) ),
]

// Exported (per the 2026-08-19 lightbox-persistence revision) so
// MirrorCalculator.jsx can seed/reset `include` itself - `include`/
// `preset` are now lifted there, alongside substrateInfo/label/settings,
// so each lightbox entry can carry its own Pricing/Weight tab state (see
// MirrorCalculator's loadEntry/handleAddToLightbox).
export function presetInclude( presetKey )
{
  if( 'all' === presetKey )
    return Object.fromEntries( PRICING_ROWS.map( r => [r.key, true] ) )
  if( 'none' === presetKey )
    return Object.fromEntries( PRICING_ROWS.map( r => [r.key, false] ) )

  const config = CONFIGURATIONS.find( c => c.key === presetKey )
  const factorKeys = new Set( config?.factorKeys ?? [] )

  return Object.fromEntries( PRICING_ROWS.map( r => [r.key, factorKeys.has( r.key )] ) )
}

// Sums cogs/wholesale/retail (and the labor-only owner/assistant split)
// across whichever rows are passed in, filtered to only those currently
// checked "Include" - shared by each section's subtotal and the grand
// Total row (which is really just "every row's" subtotal).
function sumRows( rows, rowsByKey, include )
{
  const totals = { cogs: 0, wholesale: 0, retail: 0 }
  let assistantTotal = 0
  let ownerTotal = 0

  for( const row of rows )
  {
    const data = rowsByKey[row.key]

    if( !data || !include[row.key] )
      continue

    totals.cogs += data.cogsCost
    totals.wholesale += data.wholesaleCost
    totals.retail += data.retailCost
    assistantTotal += data.assistantCost
    ownerTotal += data.ownerCost
  }

  return { totals, assistantTotal, ownerTotal }
}

// Owner labor never enters COGS at all (see computeFactorRow in
// configurationCost.js); it's folded into Wholesale at the markup factor,
// then Retail on top of that - so the Assistant/Owner split shown in a
// Labor subtotal's tooltip has to be computed per-column rather than
// reusing one raw {assistantTotal, ownerTotal} pair for every column.
function laborColumnBreakdown( columnKey, assistantTotal, ownerTotal, markupFactor, retailMultiplier )
{
  if( 'cogs' === columnKey )
    return { assistant: assistantTotal, owner: 0 }
  if( 'wholesale' === columnKey )
    return { assistant: assistantTotal * markupFactor, owner: ownerTotal }

  return { assistant: assistantTotal * markupFactor * retailMultiplier, owner: ownerTotal * retailMultiplier }
}

function laborSplitTooltip( assistant, owner )
{
  return `Assistant: ${formatCost( assistant )}, Owner: ${formatCost( owner )}`
}

// Weight tab's counterpart to sumRows above - just a single $-less sum
// (each Material row's own weight, from computeVisualizerStats's `weight`
// map) across whichever rows are currently checked "Include".
function sumWeightRows( rows, weight, include )
{
  let total = 0

  for( const row of rows )
    if( include[row.key] )
      total += weight[row.key] ?? 0

  return total
}

// --- Area/Packaging (shared shape: one row label, several columns) --------

function MetricTable( {rows, columns, values} )
{
  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell />
          {columns.map( c => <TableCell key={c.key} align='right'>{c.label}</TableCell> )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map( row => (
          <TableRow key={row.key}>
            <TableCell>{row.label}</TableCell>
            {columns.map( c => (
              <TableCell key={c.key} align='right'>{c.format( values[row.key] )}</TableCell>
            ) )}
          </TableRow>
        ) )}
      </TableBody>
    </Table>
  )
}

function ProductionTable( {computed} )
{
  return (
    <Table size='small'>
      <TableBody>
        {PRODUCTION_ROWS.map( row => (
          <TableRow key={row.key}>
            <TableCell>{row.label}</TableCell>
            <TableCell align='right'>{row.format( row.get( computed ) )}</TableCell>
          </TableRow>
        ) )}
      </TableBody>
    </Table>
  )
}

// --- Pricing ----------------------------------------------------------------

// Lets a Pricing/Weight-tab cell click into an editable "what-if" override
// (see pricingOverrides/weightOverrides in the main component) - the
// underlying cost math re-derives from it live (the two Sheet Breakage
// rows even re-run the real sheet-nesting formula through
// buildSyntheticProduct - see SHEET_BREAKAGE_KEYS in configurationCost.js),
// but nothing here is ever persisted server-side; it's a scratch pad for
// exploring "what if this were N instead," not the real per-product
// ProductCostOverride system (though see MirrorCalculator.jsx for how it
// now travels with the Visualizer's own lightbox/URL/session state). Per
// the 2026-08-19 revision this is shared by all four of a Pricing row's
// cells (Quantity/COGS/Wholesale/Retail, not just Quantity) - whichever
// one is actually edited becomes that row's single override source (see
// `overridden`/`computedValue`, passed in per-cell by the caller), and the
// other three recompute from it, the same way they would from a Quantity
// edit. An overridden value renders in a distinct color with a tooltip
// showing the computed original; the small X shown while editing reverts
// the whole row's override, regardless of which cell sourced it. Single
// click to start editing, with the draft's text pre-selected on focus -
// same convention as EditableLabel.jsx's name field, rather than the
// double-click this used before the 2026-08-19 revision.
function EditableQuantityCell( {value, computedValue, overridden, formatValue, onCommit, onRevert} )
{
  const [editing, setEditing] = useState( false )
  const [draft, setDraft] = useState( '' )

  function startEditing()
  {
    // Rounded to 2 decimal places (matching every computed figure shown
    // elsewhere on the Visualizer's tabs) rather than the raw value's
    // full floating-point precision - most visible on a Quantity implied
    // from a COGS/Wholesale/Retail-cell edit (see the 2026-08-19
    // revision's column propagation), which otherwise lands on a long,
    // ugly decimal.
    setDraft( null == value ? '' : String( Math.round( value * 100 ) / 100 ) )
    setEditing( true )
  }

  function commit()
  {
    const parsed = Number( draft )

    if( '' !== draft.trim() && Number.isFinite( parsed ) )
      onCommit( parsed )
    setEditing( false )
  }

  function handleKeyDown( evt )
  {
    if( 'Enter' === evt.key )
      commit()
    if( 'Escape' === evt.key )
      setEditing( false )
  }

  if( editing )
    return (
      <TableCell align='right'>
        <Stack direction='row' spacing={0.5} justifyContent='flex-end' alignItems='center'>
          {/* onMouseDown here would otherwise blur the TextField first,
              which fires its onBlur (commit()) - that both re-applies
              the just-edited draft as an override AND unmounts this very
              button (editing -> false) before the click event it started
              can ever reach it, so onRevert() below silently never runs.
              preventDefault stops the focus-shift blur from happening at
              all, so the click lands normally. */}
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

// Shared by PricingTable and WeightTable (see below) - one Include-
// checkbox + label + editable Quantity cell row, with whatever trailing
// $/Weight cell(s) the caller supplies as `children`. This is the actual
// "reuse part of the Pricing tab table" piece the Weight tab's table is
// built from (see the 2026-08-19 revision).
function IncludeRow( {row, data, label, include, onIncludeChange, onQuantityCommit, onQuantityRevert, children} )
{
  return (
    <TableRow>
      <TableCell padding='checkbox'>
        <Checkbox
          size='small'
          checked={Boolean( include[row.key] )}
          onChange={evt => onIncludeChange( row.key, evt.target.checked )}
        />
      </TableCell>
      <TableCell>{label}</TableCell>
      {data ? (
        <EditableQuantityCell
          value={row.pieceCount ? data.pieceCount : data.quantity}
          computedValue={row.pieceCount ? data.computedPieceCount : data.computedQuantity}
          overridden={'quantity' === data.overrideSource}
          formatValue={row.pieceCount ? formatPiecesPerSheet : v => formatQuantity( v, data.unit )}
          onCommit={val => onQuantityCommit( row.key, val )}
          onRevert={() => onQuantityRevert( row.key )}
        />
      ) : (
        <TableCell align='right'>—</TableCell>
      )}
      {children}
    </TableRow>
  )
}

function PricingTable( {
  rowsByKey,
  factorsByKey,
  include,
  onIncludeChange,
  preset,
  onPresetChange,
  columnVisible,
  expandedSection,
  onToggleSection,
  markupFactor,
  retailMultiplier,
  onQuantityCommit,
  onQuantityRevert,
  onDollarCommit,
} )
{
  const visibleColumns = PRICING_COLUMNS.filter( c => columnVisible[c.key] )
  const colSpan = 3 + visibleColumns.length

  const grandTotal = sumRows( PRICING_ROWS, rowsByKey, include )

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell sx={{minWidth: 130}}>
            <Select
              variant='outlined'
              size='small'
              value={preset}
              onChange={evt => onPresetChange( evt.target.value )}
              sx={{
                fontSize: '0.8125rem',

                // The theme's MuiSelect override (@core/theme/overrides/
                // select.jsx) absolutely-positions the dropdown arrow
                // (right: '1rem', ~1.375rem wide for a 'small' input - see
                // its iconStyles()/MuiInputBase-inputSizeSmall rule)
                // rather than reserving space for it via padding, so the
                // select's own text otherwise runs right up against it (and
                // the left edge) with no breathing room. The arrow's own
                // left edge sits ~2.375rem (1rem + 1.375rem) in from the
                // right, so paddingInlineEnd has to clear THAT, not just
                // leave a couple pixels - !important since the override's
                // own specificity otherwise wins.
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
          {visibleColumns.map( c => <TableCell key={c.key} align='right'>{c.label}</TableCell> )}
        </TableRow>
      </TableHead>
      <TableBody>
        {PRICING_SECTIONS.map( section => {
          const sectionRows = PRICING_ROWS.filter( r => r.section === section )
          const expanded = Boolean( expandedSection[section] )
          const { totals, assistantTotal, ownerTotal } = sumRows( sectionRows, rowsByKey, include )
          const subtotalLabel = `${section} Subtotal`

          return (
            <Fragment key={section}>
              <TableRow
                hover
                onClick={() => onToggleSection( section )}
                sx={{cursor: 'pointer', backgroundColor: 'action.hover'}}
              >
                <TableCell colSpan={colSpan}>
                  <Typography variant='caption' fontWeight={600} sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                    <i className={expanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
                    {section}
                  </Typography>
                </TableCell>
              </TableRow>
              {expanded && sectionRows.map( row => (
                <IncludeRow
                  key={row.key}
                  row={row}
                  data={rowsByKey[row.key]}
                  label={row.label ?? factorsByKey[row.key]?.label ?? row.key}
                  include={include}
                  onIncludeChange={onIncludeChange}
                  onQuantityCommit={onQuantityCommit}
                  onQuantityRevert={onQuantityRevert}
                >
                  {visibleColumns.map( c => {
                    const data = rowsByKey[row.key]

                    if( !data )
                      return <TableCell key={c.key} align='right'>—</TableCell>

                    return (
                      <EditableQuantityCell
                        key={c.key}
                        value={data[`${c.key}Cost`]}
                        computedValue={data.computedCost[c.key]}
                        overridden={data.overrideSource === c.key}
                        formatValue={formatCost}
                        onCommit={val => onDollarCommit( row.key, c.key, val )}
                        onRevert={() => onQuantityRevert( row.key )}
                      />
                    )
                  } )}
                </IncludeRow>
              ) )}
              <TableRow hover={'Labor' === section}>
                <TableCell />
                <TableCell>{subtotalLabel}</TableCell>
                <TableCell />
                {visibleColumns.map( c => {
                  const cellValue = formatCost( totals[c.key] )

                  if( 'Labor' !== section )
                    return <TableCell key={c.key} align='right'>{cellValue}</TableCell>

                  const { assistant, owner } = laborColumnBreakdown( c.key, assistantTotal, ownerTotal, markupFactor, retailMultiplier )

                  return (
                    <Tooltip key={c.key} title={laborSplitTooltip( assistant, owner )}>
                      <TableCell align='right'>{cellValue}</TableCell>
                    </Tooltip>
                  )
                } )}
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
          {visibleColumns.map( c => {
            const { assistant, owner } = laborColumnBreakdown(
              c.key,
              grandTotal.assistantTotal,
              grandTotal.ownerTotal,
              markupFactor,
              retailMultiplier
            )

            return (
              <Tooltip key={c.key} title={laborSplitTooltip( assistant, owner )}>
                <TableCell align='right'>
                  <Typography variant='subtitle2'>{formatCost( grandTotal.totals[c.key] )}</Typography>
                </TableCell>
              </Tooltip>
            )
          } )}
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// Weight tab, per the 2026-08-19 revision - reuses the Pricing tab's
// Material section (MATERIAL_ROWS, defined above PRICING_ROWS/
// PRICING_SECTIONS) and its IncludeRow (shared with PricingTable above),
// including the same preset dropdown/checkboxes/editable Quantity cells -
// `include`/`preset`/`onIncludeChange`/`onPresetChange`/
// `onQuantityCommit`/`onQuantityRevert` are the very same state PricingTable
// reads and writes, so toggling either tab keeps the other in sync. Unlike
// PricingTable this is a single, always-expanded, unnamed section (no
// header row, no collapse toggle) with one Weight column in place of
// COGS/Wholesale/Retail, and no per-section Subtotal row - the Total row
// alone is enough when there's only ever the one section.
function WeightTable( {rows, rowsByKey, weight, factorsByKey, include, onIncludeChange, preset, onPresetChange, onQuantityCommit, onQuantityRevert} )
{
  const total = sumWeightRows( rows, weight, include )

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell sx={{minWidth: 130}}>
            <Select
              variant='outlined'
              size='small'
              value={preset}
              onChange={evt => onPresetChange( evt.target.value )}
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
          <TableCell>Material</TableCell>
          <TableCell align='right'>Quantity</TableCell>
          <TableCell align='right'>Weight</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map( row => (
          <IncludeRow
            key={row.key}
            row={row}
            data={rowsByKey[row.key]}
            label={row.label ?? factorsByKey[row.key]?.label ?? row.key}
            include={include}
            onIncludeChange={onIncludeChange}
            onQuantityCommit={onQuantityCommit}
            onQuantityRevert={onQuantityRevert}
          >
            <TableCell align='right'>{formatWeightLb( weight[row.key] ?? 0 )}</TableCell>
          </IncludeRow>
        ) )}
      </TableBody>
      <TableFooter>
        <TableRow sx={{borderTop: '2px solid', borderColor: 'divider', '& .MuiTableCell-root': {paddingBlock: 1.5}}}>
          <TableCell />
          <TableCell><Typography variant='subtitle2'>Total</Typography></TableCell>
          <TableCell />
          <TableCell align='right'><Typography variant='subtitle2'>{formatWeightLb( total )}</Typography></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// --- Main component ---------------------------------------------------------

// Area/Weight/Packaging/Production/Pricing for the single working panel, as
// a tab switcher - the Pricing tab is the real per-factor cost breakdown
// (same math as the product-costing system - see configurationCost.js),
// with a per-row "Include" checkbox (bulk-settable via a configuration
// preset dropdown in its header) standing in for what a real product would
// build. Which tabs show at all, and which of Pricing's COGS/Wholesale/
// Retail columns show, are controlled from MirrorCalculator's own kebab
// menu (see the 2026-08-03 revision, which merged this component's earlier
// standalone kebab into that pre-existing one) - `tabVisible`/
// `pricingColumnVisible` are therefore controlled props here, not local
// state. Tab order, on the other hand, is purely a drag-and-drop gesture on
// the tab strip itself (no menu control needed for it), so it stays local
// state (`tabOrder`) - same native-HTML5-drag-API pattern LightboxStrip.jsx
// already uses for reordering the gallery.
//
// `include`/`preset`/`pricingOverrides`/`weightOverrides` (below) also
// drive the Pricing tab's "Create New Product..." button (see
// CreateNewProductDialog.jsx, which replaced the old ⋮ menu's "Save New
// Wooden Base.../Save New Mirror Glass..." items). Per the 2026-08-19
// lightbox-persistence revision these are now lifted to MirrorCalculator
// (rather than local state here) alongside substrateInfo/label/settings,
// so each lightbox entry can carry its own Pricing/Weight tab state and
// none of it is lost navigating away from the Visualizer - see
// MirrorCalculator's loadEntry/handleAddToLightbox/updateSelectedEntry.
// `expandedSection`/`tabOrder` stay local, ambient UI state (which
// sections are expanded, which order the tabs are dragged into) rather
// than data worth persisting per entry.
export default function StatsSummary( {
  mirror,
  label,
  substrateInfo,
  outsideContour,
  insideContour,
  rabbetContour,
  shopSettings,
  costFactors,
  products,
  tabVisible,
  pricingColumnVisible,
  include,
  onIncludeChange,
  preset,
  onPresetChange,
  pricingOverrides,
  onPricingOverrideCommit,
  onPricingOverrideRevert,
  weightOverrides,
  onWeightOverrideCommit,
  onWeightOverrideRevert,
} )
{
  const [tabOrder, setTabOrder] = useState( () => TABS.map( t => t.key ) )
  const [dragTabKey, setDragTabKey] = useState( null )
  const [activeKey, setActiveKey] = useState( 'area' )
  const [expandedSection, setExpandedSection] = useState( {Material: true, Breakage: true, Machine: true, Labor: true} )
  const [createProductOpen, setCreateProductOpen] = useState( false )

  const stats = useMemo( () => {
    if( !mirror )
      return null

    return computeVisualizerStats(
      substrateInfo,
      outsideContour,
      insideContour,
      rabbetContour,
      shopSettings,
      costFactors ?? [],
      pricingOverrides,
      weightOverrides
    )
  }, [mirror, substrateInfo, outsideContour, insideContour, rabbetContour, shopSettings, costFactors, pricingOverrides, weightOverrides] )

  const areaStats = useMemo( () => (stats ? computeAreaStats( mirror, stats.computed ) : null), [mirror, stats] )
  const factorsByKey = useMemo( () => Object.fromEntries( (costFactors ?? []).map( f => [f.key, f] ) ), [costFactors] )

  if( !mirror || !stats || !areaStats )
    return null

  function handleToggleSection( section )
  {
    setExpandedSection( prev => ({...prev, [section]: !prev[section]}) )
  }

  // Quantity-cell edits pass the drafted value straight through as this
  // row's override; COGS/Wholesale/Retail-cell edits (per the 2026-08-19
  // revision) are inverted to the equivalent Quantity first (see
  // impliedQuantityFromColumn/computeUnitRates in configurationCost.js) so
  // from computeVisualizerStats's point of view every override is a
  // Quantity override, just tagged with which column actually sourced it.
  function handlePricingQuantityCommit( key, value )
  {
    onPricingOverrideCommit( key, {value, source: 'quantity'} )
  }

  function handlePricingDollarCommit( key, columnKey, value )
  {
    const implied = impliedQuantityFromColumn( stats.rowsByKey[key], columnKey, value )

    if( null != implied )
      onPricingOverrideCommit( key, {value: implied, source: columnKey} )
  }

  function handleWeightQuantityCommit( key, value )
  {
    onWeightOverrideCommit( key, {value, source: 'quantity'} )
  }

  function handleTabDrop( targetKey )
  {
    setTabOrder( prev => {
      if( !dragTabKey || dragTabKey === targetKey )
        return prev

      const next = [...prev]
      const from = next.indexOf( dragTabKey )
      const to = next.indexOf( targetKey )

      if( -1 === from || -1 === to )
        return prev

      next.splice( from, 1 )
      next.splice( to, 0, dragTabKey )

      return next
    } )
    setDragTabKey( null )
  }

  const visibleTabs = tabOrder
    .filter( key => tabVisible[key] )
    .map( key => TABS.find( t => t.key === key ) )
    .filter( Boolean )

  const active = visibleTabs.find( t => t.key === activeKey ) ?? visibleTabs[0]

  return (
    <Box>
      <Tabs
        value={active?.key ?? false}
        onChange={(evt, val) => setActiveKey( val )}
        variant='scrollable'
        scrollButtons='auto'
      >
        {visibleTabs.map( t => (
          <Tab
            key={t.key}
            value={t.key}
            label={t.label}
            draggable
            onDragStart={() => setDragTabKey( t.key )}
            onDragOver={evt => evt.preventDefault()}
            onDrop={() => handleTabDrop( t.key )}
            onDragEnd={() => setDragTabKey( null )}
          />
        ) )}
      </Tabs>

      {active?.key === 'area' && <MetricTable rows={AREA_ROWS} columns={AREA_COLUMNS} values={areaStats} />}
      {active?.key === 'weight' && (
        <WeightTable
          rows={MATERIAL_ROWS}
          rowsByKey={stats.weightRowsByKey}
          weight={stats.weight}
          factorsByKey={factorsByKey}
          include={include}
          onIncludeChange={onIncludeChange}
          preset={preset}
          onPresetChange={onPresetChange}
          onQuantityCommit={handleWeightQuantityCommit}
          onQuantityRevert={onWeightOverrideRevert}
        />
      )}
      {active?.key === 'packaging' && <MetricTable rows={PACKAGING_ROWS} columns={PACKAGING_COLUMNS} values={{}} />}
      {active?.key === 'production' && <ProductionTable computed={stats.computed} />}
      {active?.key === 'pricing' && (
        <>
          <Stack direction='row' justifyContent='flex-end' className='mbe-2'>
            <Button
              variant='outlined'
              size='small'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setCreateProductOpen( true )}
            >
              Create New Product...
            </Button>
          </Stack>
          <PricingTable
            rowsByKey={stats.rowsByKey}
            factorsByKey={factorsByKey}
            include={include}
            onIncludeChange={onIncludeChange}
            preset={preset}
            onPresetChange={onPresetChange}
            columnVisible={pricingColumnVisible}
            expandedSection={expandedSection}
            onToggleSection={handleToggleSection}
            markupFactor={stats.markupFactor}
            retailMultiplier={stats.retailMultiplier}
            onQuantityCommit={handlePricingQuantityCommit}
            onQuantityRevert={onPricingOverrideRevert}
            onDollarCommit={handlePricingDollarCommit}
          />
          <CreateNewProductDialog
            open={createProductOpen}
            onClose={() => setCreateProductOpen( false )}
            label={label}
            substrateInfo={substrateInfo}
            outsideContour={outsideContour}
            include={include}
            products={products ?? []}
          />
        </>
      )}
    </Box>
  )
}
