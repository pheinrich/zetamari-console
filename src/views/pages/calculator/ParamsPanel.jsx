import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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

function ParamsPanel( props )
{
	if( !props.substrate )
		return <></>

	const [shapes, setShapes] = useState( [] )
	const [presets, setPresets] = useState( [] )

	const [substrate, setSubstrate] = useState( props.substrate )
	const [isPercent, setIsPercent] = useState( Boolean( props.substrate.inside ) )

	const [width, setWidth] = useState( props.substrate.width )
	const [height, setHeight] = useState( props.substrate.height )
	const [border, setBorder] = useState( isPercent ? 100 * props.substrate.border : props.substrate.border )

	useEffect( () => {
		const urls = ['/api/shapes', '/api/substrates']

		Promise.all( urls.map( url => fetch( url ).then( res => res.json() ) ) )
			.then( ([shps, subs]) => {
				setShapes( shps )
				setPresets( subs.filter( s => s.isPreset ) )
			})
	}, [setShapes, setPresets] )

	function constrainToWidth( w, shapeId )
	{
		let h = height

		switch( shapeId )
		{
			case 2:
			case 6:
				// Circles and squares have only one dimensional measure.
				h = w
				break

			case 7:
				// Vesica picscis has a very specific aspect ratio.
				h = ROOT3 * w
				break
		}

		setWidth( w )
		setHeight( h )
		props.setSubstrate( {...props.substrate, width: w, height: h} )
	}

	function constrainToHeight( h, shapeId )
	{
		let w = width

		switch( shapeId )
		{
			case 2:
			case 6:
				// Circles and squares have only one dimensional measure.
				w = h
				break

			case 7:
				// Vesica picscis has a very specific aspect ratio.
				w = h / ROOT3
				break
		}

		setWidth( w )
		setHeight( h )
		props.setSubstrate( {...props.substrate, width: w, height: h} )
	}

	function constrainToBorder( b )
	{
		setBorder( b )
		props.setSubstrate( {...props.substrate, border: isPercent ? b / 100 : b} )
	}

	function toggleIsPercent()
	{
		setIsPercent( isPercent ^ true )
		setBorder( isPercent ? props.substrate.border : 100 * props.substrate.border )
	}

	function loadPreset( preset )
	{
		if( Boolean( substrate.inside ) ^ Boolean( preset.inside ) )
			toggleIsPercent()

		setSubstrate( preset )
		props.setSubstrate( {...preset, width: width, border: substrate.border} )
		constrainToWidth( width, preset.outside.shapeId )
	}

	function isSetToDefaults()
	{
		const preset = presets.find( p => p.id === substrate.id )

		return !preset ||
					 (width  === preset.width && height === preset.height && border === preset.border)
	}

	function resetToDefaults()
	{
		const preset = presets.find( p => p.id === substrate.id )

		setWidth( preset.width )
		setHeight( preset.height )
		setBorder( isPercent ? 100 * preset.border : preset.border )

		props.setSubstrate( {...props.substrate, width: preset.width, height: preset.height, border: preset.border} )
	}

	function buildMenu( set )
	{
		return set.sort( (a, b) => a.name.localeCompare( b.name ) )
			.map( s => {
				const pres = presets.filter( p => p.outside.shapeId === s.id )
					.map( p => { return {
						label: p.name,
						callback: (evt, item) => {loadPreset( p )}
					}})

					if( 0 === pres.length )
						return {label: s.name, disabled: true}
					else if( 1 === pres.length )
						return pres[0]
					else
						return {label: s.name, items: pres}
			})
	}

	const menuItemsData =
	{
		label: substrate.name,
		items:
		[
			...buildMenu( shapes.filter( s => s.isPrimitive ) ),
	  	{label: '––––––––––––––––––––––––', disabled: true },
			...buildMenu( shapes.filter( s => !s.isPrimitive ) )
		]
	}

	return (
		<Stack>
			<Stack direction='row>'>
				<NestedDropdown
					menuItemsData={menuItemsData}
					MenuProps={{elevation: 3}}
					ButtonProps={{variant: 'outlined'}}
				/>
				
				<Button
					variant='text'
					size='small'
					style={{marginLeft: 10}}
					disabled={isSetToDefaults()}
					onClick={(evt) => {resetToDefaults()}}
				>
					Reset to Defaults
				</Button>
			</Stack>			
			<Stack mt={10} direction='row'>
				<TextField
					id='width'
					helperText='Width'
					style={{width: 150}}
					value={width}
					onChange={(evt) => {setWidth( evt.target.value )}}
					onBlur={(evt) => {constrainToWidth( Number( evt.target.value ), substrate.outside.shapeId )}}
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
					onBlur={(evt) => {constrainToHeight( Number( evt.target.value ), substrate.outside.shapeId )}}
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
