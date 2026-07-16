'use client'

import { useState } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'

import { computeAreaStats, computeWeightStats, computeCostStats, formatAreaFt2, formatWeightLb, formatCost } from './calculatorStats'

const SECTIONS = [
  {label: 'Area', compute: computeAreaStats, format: formatAreaFt2},
  {label: 'Weight', compute: computeWeightStats, format: formatWeightLb},
  {label: 'Pricing', compute: computeCostStats, format: formatCost},
]

// Area/Weight/Pricing for the single working panel, as a 3-tab switcher
// rather than three stacked accordion sections - only one category's
// numbers are relevant at a time, so there's no need to keep all three
// on screen (or collapsed-but-present) at once.
export default function StatsSummary( {mirror} )
{
  const [tab, setTab] = useState( 0 )

  if( !mirror )
    return null

  const {compute, format} = SECTIONS[tab]
  const stats = compute( mirror )

  // Reserve row-space for the Pricing tab's row count (currently tied with
  // Weight for the most rows) regardless of which tab is active, so the
  // panel's height - and therefore where its top edge lands, right below
  // MirrorCalculator's flex-grow/centered ParamsPanel - stays constant as
  // the person switches tabs. Shorter tabs (Area) get invisible filler
  // rows instead.
  const fillerCount = Math.max( 0, computeCostStats( mirror ).rows.length - stats.rows.length )

  return (
    <Box>
      <Tabs value={tab} onChange={(evt, val) => setTab( val )}>
        {SECTIONS.map( s => <Tab key={s.label} label={s.label} /> )}
      </Tabs>
      <Table size='small'>
        <TableBody>
          {stats.rows.map( row => (
            <TableRow key={row.label}>
              <TableCell>{row.label}</TableCell>
              <TableCell align='right'>{format( row.value )}</TableCell>
            </TableRow>
          ) )}
          {Array.from( {length: fillerCount} ).map( (_, i) => (
            <TableRow key={`filler-${i}`} style={{visibility: 'hidden'}}>
              <TableCell colSpan={2}>&nbsp;</TableCell>
            </TableRow>
          ) )}
        </TableBody>
      </Table>
    </Box>
  )
}
