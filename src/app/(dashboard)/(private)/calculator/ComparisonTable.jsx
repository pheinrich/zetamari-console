'use client'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { computeAreaStats, computeWeightStats, computeCostStats, formatAreaFt2, formatWeightLb, formatCost } from './calculatorStats'

// One Area/Weight/Retail section: one row per open panel, one column per
// stat (Mosaic Surface, Visible Glass, ...). Pivoted from an earlier
// stat-per-row/panel-per-column layout - with panels as columns the table
// only ever grew wider as panels were added, and columns didn't line up
// cleanly under their headers. Panels as rows instead lets the table grow
// vertically (the natural direction for "add another panel") and keeps
// the width bounded by the fixed set of stat columns.
function ComparisonSection( {title, panels, compute, format} )
{
  const stats = panels.map( p => compute( p.mirror ) )
  const columnLabels = stats[0]?.rows.map( r => r.label ) ?? []

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='subtitle1'>{title}</Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Panel</TableCell>
            {columnLabels.map( label => <TableCell key={label} align='right'>{label}</TableCell> )}
          </TableRow>
        </TableHead>
        <TableBody>
          {panels.map( (p, i) => (
            <TableRow key={p.id}>
              <TableCell>{p.label}</TableCell>
              {stats[i].rows.map( (row, ri) => (
                <TableCell key={columnLabels[ri]} align='right'>{format( row.value )}</TableCell>
              ) )}
            </TableRow>
          ) )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function ComparisonTable( {panels} )
{
  // Only panels with a resolved mirror can be compared - one still
  // loading/degenerate (see the crash Dimensions.jsx used to hit) just
  // doesn't contribute a row yet rather than breaking the table.
  const ready = panels.filter( p => p.mirror )

  if( 0 === ready.length )
    return null

  return (
    <div className='flex flex-col gap-6'>
      <ComparisonSection title='Area' panels={ready} compute={computeAreaStats} format={formatAreaFt2} />
      <ComparisonSection title='Weight' panels={ready} compute={computeWeightStats} format={formatWeightLb} />
      <ComparisonSection title='Retail' panels={ready} compute={computeCostStats} format={formatCost} />
    </div>
  )
}
