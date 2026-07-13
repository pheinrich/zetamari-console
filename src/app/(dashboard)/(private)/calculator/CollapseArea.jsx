'use client'

import { useState } from 'react'

import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

function AreaStat( {label, value} )
{
  if( undefined === value )
    value = 0

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align='right'>{value.toFixed( 2 )} in<sup>2</sup></TableCell>
      <TableCell align='right'>{(value / 144).toFixed( 2 )} ft<sup>2</sup></TableCell>
    </TableRow>
  )
}

export default function CollapseArea( {mirror} )
{
  const [expanded, setExpanded] = useState( false )

  const totalArea = mirror.outside?.dims?.area - mirror.inside?.dims?.area
  const visibleGlassArea = mirror.inside?.dims?.area
  const substrateOBBArea = mirror.outside?.obb.area
  const glassOBBArea = mirror.glass?.obb.area

  return (
    <>
      <Grid container alignItems='center'>
        <Grid size={1}>
          <IconButton size='small' onClick={() => setExpanded( !expanded )} aria-expanded={expanded} aria-label='show more'>
            <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          </IconButton>
        </Grid>
        <Grid size={2}>
          <Typography variant='h6' align='left'>Area:</Typography>
        </Grid>
        <Grid size={9}>
          <Typography variant='h6' align='right'>{(totalArea / 144).toFixed( 2 )} ft<sup>2</sup></Typography>
        </Grid>
      </Grid>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Table size='small'>
          <TableBody>
            <AreaStat label='Mosaic Surface' value={totalArea} />
            <AreaStat label='Visible Glass' value={visibleGlassArea} />
            <AreaStat label='Minimum Rect: Frame' value={substrateOBBArea} />
            <AreaStat label='Minimum Rect: Glass' value={glassOBBArea} />
          </TableBody>
        </Table>
      </Collapse>
    </>
  )
}
