'use client'

import { useState } from 'react'

import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { computeAreaStats, computeWeightStats, computeCostStats, formatAreaFt2, formatWeightLb, formatCost } from './calculatorStats'

// One Area/Weight/Retail section for the single working panel: an
// always-visible headline plus an expandable itemized breakdown. This is
// the single-panel counterpart to the old multi-panel ComparisonTable -
// with only one panel on screen at a time there's nothing to compare
// side by side against, just this panel's own numbers.
function StatSection( {title, mirror, compute, format} )
{
  const [expanded, setExpanded] = useState( false )
  const stats = compute( mirror )

  return (
    <Table size='small'>
      <TableBody>
        <TableRow>
          <TableCell>
            <IconButton size='small' onClick={() => setExpanded( !expanded )} aria-expanded={expanded} aria-label='show more'>
              <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
            </IconButton>
            <Typography component='span' variant='subtitle1'>{title}</Typography>
          </TableCell>
          <TableCell align='right'>
            <Typography variant='subtitle1'>{format( stats.headline )}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{padding: 0, borderBottom: expanded ? undefined : 'none'}} colSpan={2}>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <Table size='small'>
                <TableBody>
                  {stats.rows.map( row => (
                    <TableRow key={row.label}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell align='right'>{format( row.value )}</TableCell>
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

export default function StatsSummary( {mirror} )
{
  if( !mirror )
    return null

  return (
    <div className='flex flex-col gap-4'>
      <StatSection title='Area' mirror={mirror} compute={computeAreaStats} format={formatAreaFt2} />
      <StatSection title='Weight' mirror={mirror} compute={computeWeightStats} format={formatWeightLb} />
      <StatSection title='Retail' mirror={mirror} compute={computeCostStats} format={formatCost} />
    </div>
  )
}
