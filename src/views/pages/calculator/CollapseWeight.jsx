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

const SUBSTRATE_WEIGHT_LBIN2 = 0.008
const TESSERAE_WEIGHT_LBIN2 = 0.022
const GLASS_WEIGHT_LBIN2 = 0.0103125

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

function WeightStat( {label, value} )
{
  if( undefined === value )
    value = 0

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align='right'>{(16*value).toFixed( 2 )} oz</TableCell>
      <TableCell align='right'>{value.toFixed( 2 )} lb</TableCell>
    </TableRow>
  )
}

export default function CollapseWeight( {mirror} )
{
  const [expanded, setExpanded] = useState( false )

  const totalArea = mirror.outside?.dims?.area - mirror.inside?.dims?.area
  const glassArea = mirror.glass?.dims?.area

  const frameWeight = totalArea*SUBSTRATE_WEIGHT_LBIN2
  const glassWeight = glassArea*GLASS_WEIGHT_LBIN2
  const tesseraeWeight = totalArea*TESSERAE_WEIGHT_LBIN2
  const substrateWeight = frameWeight + glassWeight
  const kitWeight = substrateWeight + tesseraeWeight

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
          <Typography variant='h5' align='left'>Weight:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h5' align='right'>{substrateWeight.toFixed( 2 )} lb</Typography>
        </Grid>
      </Grid>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Table>
          <TableBody>
            <WeightStat label='Frame' value={frameWeight} />
            <WeightStat label='Glass' value={glassWeight} />
            <WeightStat label='Tesserae' value={tesseraeWeight} />
            <WeightStat label='Substrate (Frame + Glass)' value={substrateWeight} />
            <WeightStat label='Kit (Frame + Glass + Tesserae)' value={kitWeight} />
          </TableBody>
        </Table>
      </Collapse>
    </>
  )
}
