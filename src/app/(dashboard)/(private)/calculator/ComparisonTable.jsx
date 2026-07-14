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
function ComparisonSection( {title, rows, compute, format, selectedId, onSelectEntry, sortState, onSort} )
{
  const stats = rows.map( r => compute( r.mirror ) )
  const columnLabels = stats[0]?.rows.map( s => s.label ) ?? []

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
    <Accordion>
      <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {columnLabels.map( (label, col) => {
                const active = sortState?.section === title && sortState?.col === col
                return (
                  <TableCell key={label} align='right' sortDirection={active ? sortState.dir : false}>
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
                <TableCell>
                  <Typography
                    component='span'
                    variant='body2'
                    onClick={() => onSelectEntry( r.id )}
                    style={{cursor: 'pointer', fontWeight: r.id === selectedId ? 600 : 400}}
                  >
                    {r.label}
                  </Typography>
                </TableCell>
                {stats[i].rows.map( (s, si) => (
                  <TableCell key={columnLabels[si]} align='right'>{format( s.value )}</TableCell>
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
// `selectedId`/`onSelectEntry` let clicking a row's name select that
// entry exactly like clicking its lightbox thumbnail would; `onReorder`
// is called with the full reordered id list whenever a column header is
// clicked to sort, so the caller can apply that same order to `gallery`
// (which the lightbox strip and every section here all derive from).
export default function ComparisonTable( {gallery, contours, selectedId, onSelectEntry, onReorder} )
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

  return (
    <div className='flex flex-col gap-2'>
      {SECTIONS.map( s => (
        <ComparisonSection
          key={s.title}
          title={s.title}
          rows={rows}
          compute={s.compute}
          format={s.format}
          selectedId={selectedId}
          onSelectEntry={onSelectEntry}
          sortState={sortState}
          onSort={handleSort}
        />
      ) )}
    </div>
  )
}
