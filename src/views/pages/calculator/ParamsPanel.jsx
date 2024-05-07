import { useState } from 'react'
import { SVGData } from 'src/services/svgData'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const ROOT3 = Math.sqrt( 3 )

function ParamsPanel( {params} )
{
	const [outsideId, setOutsideId] = useState( params.outsideId )
	const [insideId, setInsideId] = useState( params.insideId )
	const [rabbetId, setRabbetId] = useState( params.rabbetId )
	const [isPercent, setIsPercent] = useState( Boolean( params.insideId ) )
	const [width, setWidth] = useState( params.width )
	const [height, setHeight] = useState( params.height )
	const [border, setBorder] = useState( isPercent ? 100 * params.border : params.border )

	function constrainToWidth( id, w )
	{
		let h = height

		if( 2 === id || 6 === id )
		{
			// Circles and squares have only one dimensional measure.
			h = w
		}
		else if( 7 === id )
		{
			// Vesica picscis has a very specific aspect ratio.
			h = ROOT3 * w
		}

		setWidth( w )
		params.setWidth( w )
		setHeight( h )
		params.setHeight( h )
	}

	function constrainToHeight( id, h )
	{
		let w = width

		if( 2 === id || 6 === id )
		{
			// Circles and squares have only one dimensional measure.
			w = h
		}
		else if( 7 === id )
		{
			// Vesica picscis has a very specific aspect ratio.
			w = h / ROOT3
		}

		setWidth( w )
		params.setWidth( w )
		setHeight( h )
		params.setHeight( h )
	}

	function constrainToBorder( b )
	{
		setBorder( b )
		params.setBorder( isPercent ? b / 100 : b )
	}

	function toggleIsPercent()
	{
		setIsPercent( isPercent ^ true )
		setBorder( isPercent ? params.border : 100 * params.border )
	}

	function updateContours( o, i, r )
	{
		if( Boolean( i ) ^ Boolean( insideId ) )
			toggleIsPercent()

		setOutsideId( o )
		params.setOutsideId( o )
		setInsideId( i )
		params.setInsideId( i )
		setRabbetId( r )
		params.setRabbetId( r )

		constrainToWidth( o, width )
	}

	return (
		<Stack>
		  <Box>
				<FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
					<InputLabel id='outside-contour-select-label'>Outside Contour</InputLabel>
					<Select
						labelId='outside-contour-select-label'
						id='outside-select'
						label='Outside Contour'
						value={params.outsideId}
						onChange={(evt) => {updateContours( evt.target.value, insideId, rabbetId )}}
					>
						{SVGData.outside.filter( item => 7 >= item.id ).map( item => (
							<MenuItem key={item.id} value={item.id}>
          			{item.label}
        			</MenuItem>
        		))}
        		<Divider />
						{SVGData.outside.filter( item => 7 < item.id ).map( item => (
							<MenuItem key={item.id} value={item.id}>
          			{item.label}
        			</MenuItem>
        		))}
					</Select>
				</FormControl>

				<FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
					<InputLabel id='inside-contour-select-label'>Inside Contour</InputLabel>
					<Select
						labelId='inside-contour-select-label'
						id='inside-select'
						label='Inside Contour'
						value={undefined === params.insideId ? 0 : params.insideId}
						onChange={(evt) => {updateContours( outsideId, evt.target.value, rabbetId )}}
					>
						<MenuItem value={0}><em>Computed</em></MenuItem>
						{SVGData.inside.map( item => (
							<MenuItem key={item.id} value={item.id}>
          			{item.label}
        			</MenuItem>
        		))}
					</Select>
				</FormControl>

				<FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
					<InputLabel id='rabbet-contour-select-label'>Rabbet Contour</InputLabel>
					<Select
						labelId='rabbet-contour-select-label'
						id='rabbet-select'
						label='Rabbet Contour'
						value={undefined === params.rabbetId ? 0 : params.rabbetId}
						onChange={(evt) => {updateContours( outsideId, insideId, evt.target.value )}}
					>
						<MenuItem value={0}><em>Computed</em></MenuItem>
						{SVGData.rabbet.map( item => (
							<MenuItem key={item.id} value={item.id}>
          			{item.label}
        			</MenuItem>
        		))}
					</Select>
				</FormControl>
			</Box>

			<Stack mt={15} direction='row'>
				<TextField
					id='width'
					helperText='Width'
					style={{width: 150}}
					value={width}
					onChange={(evt) => {setWidth( evt.target.value )}}
					onBlur={(evt) => {constrainToWidth( outsideId, Number( evt.target.value ) )}}
					InputProps={{
						endAdornment: <InputAdornment position='end'>in</InputAdornment>
					}}
				>
				</TextField>
				<Typography m={2} variant='h5'>X</Typography>
				<TextField
					id='height'
					helperText='Height'
					style={{width: 150}}
					value={height}
					onChange={(evt) => {setHeight( evt.target.value )}}
					onBlur={(evt) => {constrainToHeight( outsideId, Number( evt.target.value ) )}}
					InputProps={{
						endAdornment: <InputAdornment position='end'>in</InputAdornment>
					}}
				/>
				<Typography m={2} variant='h5'>/</Typography>
				<TextField
					id='border'
					helperText='Border'
					style={{width: 150}}
					value={border}
					onChange={(evt) => {setBorder( evt.target.value )}}
					onBlur={(evt) => {constrainToBorder( Number( evt.target.value ) )}}
					InputProps={{
						endAdornment: <InputAdornment position='end'>
						{ isPercent ? '%' : 'in' }
						</InputAdornment>
					}}
				/>
			</Stack>
			<Box mt={15} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
			  Testing
			</Box>
		</Stack>
	)
}

export default ParamsPanel
