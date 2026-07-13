'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const ROOT3 = Math.sqrt( 3 )

// Shape types whose outside contour constrains height/width to a fixed
// aspect ratio (matches buildFromType()'s geometry in @/libs/mirror -
// circles/squares are 1:1, vesica piscis is 1:root(3)).
function constrainedHeight( width, shapeType )
{
  if( 'circle' === shapeType || 'square' === shapeType )
    return width
  if( 'vesica picscis' === shapeType )
    return ROOT3 * width

  return undefined
}

function constrainedWidth( height, shapeType )
{
  if( 'circle' === shapeType || 'square' === shapeType )
    return height
  if( 'vesica picscis' === shapeType )
    return height / ROOT3

  return undefined
}

function shapeTypeLabel( shapeType )
{
  return shapeType.replace( /\b\w/g, c => c.toUpperCase() )
}

export default function ParamsPanel( {substrateInfo, setSubstrateInfo, contours, substrateProducts, initialProduct} )
{
  const router = useRouter()
  const outsideContour = contours.find( c => c.id === substrateInfo.outsideId )
  const shapeType = outsideContour?.svgData ? undefined : outsideContour?.shapeType

  // Width/height/border are echoed from local state while typing, and only
  // pushed up to substrateInfo (which triggers a live geometry recompute -
  // see MirrorCalculator) on blur. Committing on every keystroke let
  // transient/invalid intermediate values (an empty field, a width smaller
  // than the current border, a momentarily out-of-sync width/height pair
  // for aspect-locked shapes) reach the geometry engine and produce
  // degenerate shapes - see the Dimensions.jsx crash this was fixing.
  const [width, setWidth] = useState( substrateInfo.width ?? '' )
  const [height, setHeight] = useState( substrateInfo.height ?? '' )
  const [border, setBorder] = useState( substrateInfo.border ?? '' )

  useEffect( () => { setWidth( substrateInfo.width ?? '' ) }, [substrateInfo.width] )
  useEffect( () => { setHeight( substrateInfo.height ?? '' ) }, [substrateInfo.height] )
  useEffect( () => { setBorder( substrateInfo.border ?? '' ) }, [substrateInfo.border] )

  function handleWidthBlur( evt )
  {
    const w = Number( evt.target.value )
    if( !w || !Number.isFinite( w ) )
      return setWidth( substrateInfo.width ?? '' )

    const h = constrainedHeight( w, shapeType ) ?? substrateInfo.height

    setSubstrateInfo( {...substrateInfo, width: w, height: h} )
  }

  function handleHeightBlur( evt )
  {
    const h = Number( evt.target.value )
    if( !h || !Number.isFinite( h ) )
      return setHeight( substrateInfo.height ?? '' )

    const w = constrainedWidth( h, shapeType ) ?? substrateInfo.width

    setSubstrateInfo( {...substrateInfo, width: w, height: h} )
  }

  function handleBorderBlur( evt )
  {
    const b = Number( evt.target.value )
    if( !Number.isFinite( b ) || b < 0 )
      return setBorder( substrateInfo.border ?? '' )

    setSubstrateInfo( {...substrateInfo, border: b} )
  }

  // Picking a product here reuses the same ?productId= navigation as the
  // blank calculator's entry point (see page.jsx), rather than copying its
  // outside/inside/rabbet/width/height/border into local state by hand -
  // that keeps this in one place and gets the same fresh-remount handling
  // (see MirrorCalculator's key) instead of risking stale state.
  function handleProductChange( productId )
  {
    router.push( productId ? `/calculator?productId=${productId}` : '/calculator' )
  }

  return (
    <Stack spacing={6}>
      <Box>
        <Typography variant='body2' color='text.secondary' className='mbe-2'>Product</Typography>
        <FormControl fullWidth>
          <InputLabel id='calc-product'>Load a Substrate Product</InputLabel>
          <Select
            labelId='calc-product'
            label='Load a Substrate Product'
            value={initialProduct?.id ?? ''}
            onChange={e => handleProductChange( e.target.value )}
          >
            <MenuItem value=''>— None (blank shape) —</MenuItem>
            {substrateProducts.map( p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ) )}
          </Select>
        </FormControl>
      </Box>

      <Stack direction='row' spacing={4} flexWrap='wrap'>
        <TextField
          label='Width'
          style={{width: 150}}
          value={width}
          onChange={evt => setWidth( evt.target.value )}
          onBlur={handleWidthBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>in</InputAdornment>}}
        />
        <Typography alignSelf='center' variant='h5'>X</Typography>
        <TextField
          label='Height'
          style={{width: 150}}
          value={height}
          onChange={evt => setHeight( evt.target.value )}
          onBlur={handleHeightBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>in</InputAdornment>}}
        />
        <Typography alignSelf='center' variant='h5'>/</Typography>
        <TextField
          label='Border'
          style={{width: 150}}
          value={border}
          onChange={evt => setBorder( evt.target.value )}
          onBlur={handleBorderBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>in</InputAdornment>}}
        />
      </Stack>

      {shapeType && (
        <Typography variant='caption' color='text.secondary'>
          {shapeTypeLabel( shapeType )} constrains width/height to a fixed aspect ratio.
        </Typography>
      )}
    </Stack>
  )
}
