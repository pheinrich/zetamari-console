import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

const SUBSTRATE_WEIGHT_LBIN2 = 0.008
const TESSERAE_WEIGHT_LBIN2 = 0.022
const GLASS_WEIGHT_LBIN2 = 0.0103125

const SUBSTRATE_COST_DIN2 = 0.022
const TESSERAE_COST_DIN2 = 0.3
const GLASS_COST_DIN2 = 0.025

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

export default function StatsView( {substrate, costs} )
{
  const totalArea = substrate?.outside?.dims?.area - substrate?.inside?.dims?.area
  const visibleGlassArea = substrate?.inside?.dims?.area
  const glassArea = substrate?.glass?.dims?.area
  const substrateWeight = totalArea*SUBSTRATE_WEIGHT_LBIN2 + glassArea*GLASS_WEIGHT_LBIN2
  const kitWeight = substrateWeight + totalArea*TESSERAE_WEIGHT_LBIN2
  const substrateOBBArea = substrate?.outside?.obb.area
  const glassOBBArea = substrate?.glass?.obb.area
  const substrateCost = substrateOBBArea*SUBSTRATE_COST_DIN2 + glassOBBArea*GLASS_COST_DIN2
  const kitCost = substrateCost + totalArea*TESSERAE_COST_DIN2

	return (
		<Card sx={{ mt: 10 }}>
			<CardContent>
				<Table>
					<TableBody>
						<AreaStat label='Total Area' value={totalArea} />
						<AreaStat label='Visible Glass Area' value={visibleGlassArea} />
						<WeightStat label='Substrate Weight (Wood + Glass)' value={substrateWeight} />
						<CostStat label='Substrate Cost' value={substrateCost} />
						<WeightStat label='Kit Weight (Substrate + Tesserae)' value={kitWeight} />
						<CostStat label='Kit Cost' value={kitCost} />
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}