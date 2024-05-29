import { useState } from 'react'

import { styled } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(270deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

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
  const glassArea = mirror.glass?.dims?.area
  const substrateOBBArea = mirror.outside?.obb.area
  const glassOBBArea = mirror.glass?.obb.area

  return (
    <>
      <Grid container>
        <Grid item xs={1}>
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded( !expanded )}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Grid>
        <Grid item xs={1}>
          <Typography variant='h5' align='left'>Area:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h5' align='right'>{(totalArea / 144).toFixed( 2 )} ft<sup>2</sup></Typography>
        </Grid>
      </Grid>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Table>
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
