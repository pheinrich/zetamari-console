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
        </TableBody>
      </Table>
    </Box>
  )
}
