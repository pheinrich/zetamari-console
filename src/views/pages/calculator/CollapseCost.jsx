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

const SUBSTRATE_COST_DIN2 = 0.022
const TESSERAE_COST_DIN2 = 0.3
const GLASS_COST_DIN2 = 0.025

const SUBSTRATE_RETAIL_DFT2 = 12
const TESSERAE_RETAIL_DFT2 = 87
const GLASS_RETAIL_DFT2 = 22

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

function CostStat( {label, value} )
{
	if( undefined === value )
		value = 0

	return (
		<TableRow>
			<TableCell>{label}</TableCell>
			<TableCell colSpan={2} align='right'>${value.toFixed( 2 )}</TableCell>
		</TableRow>
	)
}

export default function CollapseCost( {mirror} )
{
  const [expanded, setExpanded] = useState( false )

  const totalArea = mirror.outside?.dims?.area - mirror.inside?.dims?.area
  const substrateOBBArea = mirror.outside?.obb.area
  const glassOBBArea = mirror.glass?.obb.area

  const frameRetail = (substrateOBBArea*SUBSTRATE_RETAIL_DFT2)/144
  const glassRetail = (glassOBBArea*GLASS_RETAIL_DFT2)/144
  const tesseraeRetail = (totalArea*TESSERAE_RETAIL_DFT2)/144
  const substrateRetail = frameRetail + glassRetail
  const kitRetail = substrateRetail + tesseraeRetail

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
          <Typography variant='h5' align='left'>Retail:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h5' align='right'>${substrateRetail.toFixed( 2 )}</Typography>
        </Grid>
      </Grid>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Table>
          <TableBody>
			<CostStat label='Frame' value={frameRetail} />
			<CostStat label='Glass' value={glassRetail} />
			<CostStat label='Tesserae' value={tesseraeRetail} />
			<CostStat label='Substrate (Frame + Glass)' value={substrateRetail} />
			<CostStat label='Kit (Frame + Glass + Tesserae)' value={kitRetail} />
          </TableBody>
        </Table>
      </Collapse>
    </>
  )
}
