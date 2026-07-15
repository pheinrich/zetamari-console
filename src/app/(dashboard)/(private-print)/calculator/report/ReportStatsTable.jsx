import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import {
  computeAreaStats,
  computeWeightStats,
  computeCostStats,
  formatAreaFt2,
  formatWeightLb,
  formatCost,
} from '@/app/(dashboard)/(private)/calculator/calculatorStats'

const SECTIONS = [
  {title: 'Area', compute: computeAreaStats, format: formatAreaFt2},
  {title: 'Weight', compute: computeWeightStats, format: formatWeightLb},
  {title: 'Pricing', compute: computeCostStats, format: formatCost},
]

function SectionTable( {title, mirror, compute, format} )
{
  const stats = compute( mirror )

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='subtitle1'>{title}</Typography>
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
    </div>
  )
}

// Area/Weight/Pricing for the printed working-panel report. Unlike
// StatsSummary (tabs - only one category visible interactively at a
// time), a printed page can show everything at once, as three separate
// tables.
export default function ReportStatsTable( {mirror} )
{
  if( !mirror )
    return null

  return (
    <div className='flex flex-col gap-4'>
      {SECTIONS.map( s => (
        <SectionTable key={s.title} title={s.title} mirror={mirror} compute={s.compute} format={s.format} />
      ) )}
    </div>
  )
}
