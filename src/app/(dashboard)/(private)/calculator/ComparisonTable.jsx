'use client'

import { useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'

import { computeAreaStats, computeWeightStats, computeCostStats, formatAreaFt2, formatWeightLb, formatCost } from './calculatorStats'

// One Area/Weight/Retail section: an always-visible headline row plus an
// expandable itemized breakdown, both with one column per open panel. This
// generalizes the old single-panel CollapseArea/Weight/Cost (one value
// column) to N panels shown side by side - the actual formulas live in
// calculatorStats.js so both share one implementation.
function ComparisonSection( {title, panels, compute, format} )
{
  const [expanded, setExpanded] = useState( false )
  const stats = panels.map( p => compute( p.mirror ) )
  const rowLabels = stats[0]?.rows.map( r => r.label ) ?? []

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell />
          {panels.map( p => <TableCell key={p.id} align='right'>{p.label}</TableCell> )}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <IconButton size='small' onClick={() => setExpanded( !expanded )} aria-expanded={expanded} aria-label='show more'>
              <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
            </IconButton>
            <Typography component='span' variant='subtitle1'>{title}</Typography>
          </TableCell>
          {stats.map( (s, i) => (
            <TableCell key={panels[i].id} align='right'>
              <Typography variant='subtitle1'>{format( s.headline )}</Typography>
            </TableCell>
          ) )}
        </TableRow>
        <TableRow>
          <TableCell style={{padding: 0, borderBottom: expanded ? undefined : 'none'}} colSpan={panels.length + 1}>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <Table size='small'>
                <TableBody>
                  {rowLabels.map( (label, ri) => (
                    <TableRow key={label}>
                      <TableCell>{label}</TableCell>
                      {stats.map( (s, i) => (
                        <TableCell key={panels[i].id} align='right'>{format( s.rows[ri].value )}</TableCell>
                      ) )}
                    </TableRow>
                  ) )}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default function ComparisonTable( {panels} )
{
  // Only panels with a resolved mirror can be compared - one still
  // loading/degenerate (see the crash Dimensions.jsx used to hit) just
  // doesn't contribute a column yet rather than breaking the table.
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
