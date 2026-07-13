'use client'

import { useMemo } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
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
// doesn't get wider as more prototypes get saved.
function ComparisonSection( {title, rows, compute, format} )
{
  const stats = rows.map( r => compute( r.mirror ) )
  const columnLabels = stats[0]?.rows.map( s => s.label ) ?? []

  return (
    <Accordion>
      <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Entry</TableCell>
              {columnLabels.map( label => <TableCell key={label} align='right'>{label}</TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map( (r, i) => (
              <TableRow key={r.id}>
                <TableCell>{r.label}</TableCell>
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
export default function ComparisonTable( {gallery, contours, substrateProducts} )
{
  const rows = useMemo(
    () => gallery
      .map( entry => ({id: entry.id, label: labelForEntry( entry, substrateProducts ), mirror: resolveEntryMirror( entry, contours, substrateProducts )}) )
      .filter( r => r.mirror ),
    [gallery, contours, substrateProducts]
  )

  if( 0 === rows.length )
    return null

  return (
    <div className='flex flex-col gap-2'>
      {SECTIONS.map( s => (
        <ComparisonSection key={s.title} title={s.title} rows={rows} compute={s.compute} format={s.format} />
      ) )}
    </div>
  )
}
