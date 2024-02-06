import { useState } from 'react'
import { PrimitiveShapeType, Shape, SVGShapeType } from 'src/modules/shape.mjs'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

function MirrorOptionsForm( {shape, update} )
{
	const [type, setType] = useState( shape.type )
	const [lod, setLOD] = useState( shape.lod )
	const [width, setWidth] = useState( shape.width )
	const [height, setHeight] = useState( shape.height )
	const [border, setBorder] = useState( shape.border )

	const typeOpts = []
	for( const k in PrimitiveShapeType )
	{
		const v = PrimitiveShapeType[k]
		typeOpts.push( <MenuItem key={k} value={v}>{Shape.getTypeName( v )}</MenuItem> )
	}
	typeOpts.push( <Divider /> )
	for( const k in SVGShapeType )
	{
		const v = SVGShapeType[k]
		typeOpts.push( <MenuItem key={k} value={v}>{Shape.getTypeName( v )}</MenuItem> )
	}

	const lodOpts = []
	for( const k in shape.variants )
	{
		const v = shape.variants[ k ].nickname
		lodOpts.push( <MenuItem key={k} value={k}>{v}</MenuItem> )
	}

	return(
		<div>
	    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
	      <InputLabel>Type</InputLabel>
	      <Select
	        value={type}
	        label='Type'
	        onChange={(evt) => {setType( evt.target.value ); update(evt.target.value, 0, width, height, border)} }
	      >
	      	{typeOpts}
	      </Select>
	    </FormControl>
	    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
	      <InputLabel>LOD</InputLabel>
	      <Select
	        value={lod}
	        label='LOD'
	        onChange={(evt) => {setLOD( evt.target.value ); update(type, evt.target.value, width, height, border)} }
	      >
	      	{lodOpts}
	      </Select>
	    </FormControl>
		</div>
	)
}

export default MirrorOptionsForm
