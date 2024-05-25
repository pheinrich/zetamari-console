import { useEffect, useState } from 'react'

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

import { NestedDropdown } from 'mui-nested-menu'

const ROOT3 = Math.sqrt( 3 )

function ParamsPanel( {params} )
{
	const [shapes, setShapes] = useState( [] )
	const [presets, setPresets] = useState( [] )

	const [outside, setOutside] = useState( params.outside )
	const [inside, setInside] = useState( params.inside )
	const [rabbet, setRabbet] = useState( params.rabbet )
	const [isPercent, setIsPercent] = useState( Boolean( params.inside ) )
	const [width, setWidth] = useState( params.width )
	const [height, setHeight] = useState( params.height )
	const [border, setBorder] = useState( isPercent ? 100 * params.border : params.border )

	useEffect( () => {
		fetch( '/api/shapes' )
		  .then( (res) => res.json() )
		  .then( setShapes )

		 fetch( '/api/substrates' )
		 	.then( (res) => res.json() )
		 	.then( (all) => all.filter( item => item.isPreset ) )
		 	.then( setPresets )
	}, [])

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
		if( Boolean( i ) ^ Boolean( inside ) )
			toggleIsPercent()

		setOutside( o )
		params.setOutside( o )
		setInside( i )
		params.setInside( i )
		setRabbet( r )
		params.setRabbet( r )

		constrainToWidth( o, width )
	}

	const menuItemsData = 
	{
		label: 'Contour',
		items:
		[
			...shapes.filter( item => item.isPrimitive )
		  	.sort( (a, b) => a.name.localeCompare( b.name ) )
		  	.map( item => {return {label: item.name}} ),
		  	{label: '––––––––––––––––––––––––', disabled: true },
			...shapes.filter( item => !item.isPrimitive )
		  	.sort( (a, b) => a.name.localeCompare( b.name ) )
		  	.map( item => {
		  		let subs = presets.filter( pre => pre.outside.shapeId === item.id )
		  		let items = subs.map( pre => {return {label: pre.name}} )

		  		return {
		  			label: item.name,
		  			items: 1 < items.length ? items : []
		  		}
		  	}),
		]
	}
	
	return (
		<Stack>
			<NestedDropdown
				menuItemsData={menuItemsData}
				MenuProps={{elevation: 3}}
				ButtonProps={{variant: 'outlined'}}
				onClick={() => console.log( 'Clicked' )}
			/>
			<Stack mt={10} direction='row'>
				<TextField
					id='width'
					helperText='Width'
					style={{width: 150}}
					value={width}
					onChange={(evt) => {setWidth( evt.target.value )}}
					onBlur={(evt) => {constrainToWidth( outside, Number( evt.target.value ) )}}
					InputProps={{
						endAdornment: <InputAdornment position='end'>in</InputAdornment>
					}}
				>
				</TextField>
				<Typography m={3} variant='h5'>X</Typography>
				<TextField
					id='height'
					helperText='Height'
					style={{width: 150}}
					value={height}
					onChange={(evt) => {setHeight( evt.target.value )}}
					onBlur={(evt) => {constrainToHeight( outside, Number( evt.target.value ) )}}
					InputProps={{
						endAdornment: <InputAdornment position='end'>in</InputAdornment>
					}}
				/>
				<Typography m={3} variant='h5'>/</Typography>
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
		</Stack>
	)
}

export default ParamsPanel
