import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
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

function ConsolidatedTable( {mirror} )
{
  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell>Category</TableCell>
          <TableCell>Metric</TableCell>
          <TableCell align='right'>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {SECTIONS.flatMap( s => {
          const stats = s.compute( mirror )
          return stats.rows.map( row => (
            <TableRow key={`${s.title}-${row.label}`}>
              <TableCell>{s.title}</TableCell>
              <TableCell>{row.label}</TableCell>
              <TableCell align='right'>{s.format( row.value )}</TableCell>
            </TableRow>
          ) )
        } )}
      </TableBody>
    </Table>
  )
}

// Area/Weight/Pricing for the printed working-panel report. Unlike
// StatsSummary (tabs - only one category visible interactively at a
// time), a printed page can show everything at once: either three
// separate full tables, or - when the "consolidated" report option is on
// - one table with a Category column, all three merged into a single
// flow that won't get separated by a page break as awkwardly as three
// independent tables might.
export default function ReportStatsTable( {mirror, consolidated} )
{
  if( !mirror )
    return null

  if( consolidated )
    return <ConsolidatedTable mirror={mirror} />

  return (
    <div className='flex flex-col gap-4'>
      {SECTIONS.map( s => (
        <SectionTable key={s.title} title={s.title} mirror={mirror} compute={s.compute} format={s.format} />
      ) )}
    </div>
  )
}
