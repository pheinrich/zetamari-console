'use client'

import { useMemo, useState } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'

import { computeAreaStats, computeWeightStats, computeCostStats, formatAreaFt2, formatWeightLb, formatCost } from './calculatorStats'
import { resolveEntryMirror, labelForEntry } from './resolveEntryMirror'

const SECTIONS = [
  {title: 'Area', compute: computeAreaStats, format: formatAreaFt2},
  {title: 'Weight', compute: computeWeightStats, format: formatWeightLb},
  {title: 'Pricing', compute: computeCostStats, format: formatCost},
]

// One expandable Area/Weight/Pricing section: a table with one row per
// lightbox entry and one column per stat (Mosaic Surface, Visible Glass,
// ...) - rows growing with the gallery rather than columns, so this
// doesn't get wider as more prototypes get saved. Column headers sort
// (asc/desc) the rows by that stat; sorting reorders the underlying
// gallery itself (via onSort, up in ComparisonTable/MirrorCalculator) so
// the lightbox strip and every other section stay in the same order
// rather than each table drifting independently.
// `dense` shrinks row height/font size further than Table's own
// size='small' already does - opt-in (default off, so the live
// interactive calculator is unaffected) and used by the print reports,
// where fitting a whole gallery's comparison data on one page matters
// more than touch-friendly row height.
function ComparisonSection( {title, rows, compute, format, defaultExpanded, selectedId, onSelectEntry, sortState, onSort, dense} )
{
  const stats = rows.map( r => compute( r.mirror ) )
  const columnLabels = stats[0]?.rows.map( s => s.label ) ?? []
  const cellSx = dense ? {paddingBlock: '2px', paddingInline: '8px', fontSize: '0.7rem'} : undefined

  function handleSortClick( col )
  {
    const active = sortState?.section === title && sortState?.col === col
    const dir = active && 'asc' === sortState.dir ? 'desc' : 'asc'

    const ordered = rows
      .map( (r, i) => ({id: r.id, value: stats[i].rows[col].value}) )
      .sort( (a, b) => (a.value - b.value) * ('asc' === dir ? 1 : -1) )
      .map( r => r.id )

    onSort( {section: title, col, dir}, ordered )
  }

  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters={dense}>
      <AccordionSummary
        expandIcon={<i className='ri-arrow-down-s-line' />}
        sx={dense ? {minHeight: 32, '& .MuiAccordionSummary-content': {marginBlock: '4px'}} : undefined}
      >
        <Typography variant={dense ? 'body2' : 'body1'}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={dense ? {padding: '4px 8px 8px'} : undefined}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={cellSx}>Name</TableCell>
              {columnLabels.map( (label, col) => {
                const active = sortState?.section === title && sortState?.col === col
                return (
                  <TableCell key={label} align='right' sortDirection={active ? sortState.dir : false} sx={cellSx}>
                    <TableSortLabel
                      active={active}
                      direction={active ? sortState.dir : 'asc'}
                      onClick={() => handleSortClick( col )}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                )
              } )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map( (r, i) => (
              <TableRow key={r.id} selected={r.id === selectedId} hover>
                <TableCell sx={cellSx}>
                  <Typography
                    component='span'
                    variant={dense ? 'caption' : 'body2'}
                    onClick={() => onSelectEntry?.( r.id )}
                    style={{cursor: onSelectEntry ? 'pointer' : 'default', fontWeight: r.id === selectedId ? 600 : 400}}
                  >
                    {r.label}
                  </Typography>
                </TableCell>
                {stats[i].rows.map( (s, si) => (
                  <TableCell key={columnLabels[si]} align='right' sx={cellSx}>{format( s.value )}</TableCell>
                ) )}
              </TableRow>
            ) )}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  )
}

// Compares every saved lightbox entry side by side, below the strip
// itself - each Area/Weight/Pricing category is its own expandable
// section so all three can be checked without permanently taking up
// space. Entries without a resolvable mirror (in-flight or degenerate)
// are left out of the comparison rather than breaking it.
// `defaultExpanded` opens every section up front - used by the print
// report, where a collapsed Accordion's contents wouldn't print at all.
// `selectedId`/`onSelectEntry` let clicking a row's name select that
// entry exactly like clicking its lightbox thumbnail would; `onReorder`
// is called with the full reordered id list whenever a column header is
// clicked to sort, so the caller can apply that same order to `gallery`
// (which the lightbox strip and every section here all derive from).
// `sections` optionally restricts which of Area/Weight/Pricing render -
// {Area: true, Weight: false, Pricing: true} - undefined/omitted shows
// all three (the live calculator's usage); the lightbox print report
// uses this to let a person trim sections that don't fit on one page.
// `dense` shrinks row height/font size for the same print report - see
// ComparisonSection.
export default function ComparisonTable( {gallery, contours, defaultExpanded = true, selectedId, onSelectEntry, onReorder, sections, dense} )
{
  const [sortState, setSortState] = useState( null )

  const rows = useMemo(
    () => gallery
      .map( entry => ({id: entry.id, label: labelForEntry( entry ), mirror: resolveEntryMirror( entry, contours )}) )
      .filter( r => r.mirror ),
    [gallery, contours]
  )

  if( 0 === rows.length )
    return null

  function handleSort( state, orderedIds )
  {
    setSortState( state )
    onReorder?.( orderedIds )
  }

  const visibleSections = SECTIONS.filter( s => sections?.[s.title] ?? true )

  return (
    <div className='flex flex-col gap-2'>
      {visibleSections.map( s => (
        <ComparisonSection
          key={s.title}
          title={s.title}
          rows={rows}
          compute={s.compute}
          format={s.format}
          defaultExpanded={defaultExpanded}
          selectedId={selectedId}
          onSelectEntry={onSelectEntry}
          sortState={sortState}
          onSort={handleSort}
          dense={dense}
        />
      ) )}
    </div>
  )
}
