'use client'

import { useEffect, useState } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
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

// border is stored (in substrateInfo) as build() expects it - a fraction
// where 1 = 100% when isPercent, or a plain inches value otherwise. This
// converts that stored value to what the field should display.
function toDisplayBorder( border, isPercent )
{
  if( null === border || undefined === border || '' === border )
    return ''

  return isPercent ? 100 * border : border
}

// Dimensions-only form (width/height/border) for one panel. Which product
// (and therefore which outside/inside/rabbet contours) is loaded is
// controlled by the caller (CalculatorPanel) - this component only cares
// about the resulting shapeType (for aspect-ratio locking) and whether an
// inside contour is present (for the percent-vs-inches border switch).
export default function ParamsPanel( {substrateInfo, setSubstrateInfo, contours} )
{
  const outsideContour = contours.find( c => c.id === substrateInfo.outsideId )
  const shapeType = outsideContour?.svgData ? undefined : outsideContour?.shapeType

  // build() (@/libs/mirror) treats `border` differently depending on
  // whether an inside contour is explicitly set: with only an outside
  // contour, border is a constant inches offset (the inside contour is
  // buffered inward from the outside by that distance everywhere). Once an
  // inside contour is explicitly specified, there's no guarantee the two
  // contours are equidistant at every point, so a constant offset doesn't
  // make sense - border instead scales the inside contour, with 1 = 100%
  // (its natural/authored size, unscaled), values below 1 shrinking the
  // border (scaling the inside contour up, toward touching the outside),
  // and values above 1 growing it (scaling the inside contour down).
  const isPercent = Boolean( substrateInfo.insideId )

  // Width/height/border are echoed from local state while typing, and only
  // pushed up to substrateInfo (which triggers a live geometry recompute -
  // see CalculatorPanel) on blur. Committing on every keystroke let
  // transient/invalid intermediate values (an empty field, a width smaller
  // than the current border, a momentarily out-of-sync width/height pair
  // for aspect-locked shapes) reach the geometry engine and produce
  // degenerate shapes - see the Dimensions.jsx crash this was fixing.
  const [width, setWidth] = useState( substrateInfo.width ?? '' )
  const [height, setHeight] = useState( substrateInfo.height ?? '' )
  const [border, setBorder] = useState( () => toDisplayBorder( substrateInfo.border, isPercent ) )

  useEffect( () => { setWidth( substrateInfo.width ?? '' ) }, [substrateInfo.width] )
  useEffect( () => { setHeight( substrateInfo.height ?? '' ) }, [substrateInfo.height] )
  useEffect(
    () => { setBorder( toDisplayBorder( substrateInfo.border, isPercent ) ) },
    [substrateInfo.border, isPercent]
  )

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
    const entered = Number( evt.target.value )
    if( !Number.isFinite( entered ) || entered < 0 )
      return setBorder( toDisplayBorder( substrateInfo.border, isPercent ) )

    setSubstrateInfo( {...substrateInfo, border: isPercent ? entered / 100 : entered} )
  }

  return (
    <Stack spacing={4}>
      <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent='center'>
        <TextField
          label='Width'
          style={{width: 110}}
          value={width}
          onChange={evt => setWidth( evt.target.value )}
          onBlur={handleWidthBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>in</InputAdornment>}}
        />
        <Typography alignSelf='center' variant='h6'>X</Typography>
        <TextField
          label='Height'
          style={{width: 110}}
          value={height}
          onChange={evt => setHeight( evt.target.value )}
          onBlur={handleHeightBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>in</InputAdornment>}}
        />
        <Typography alignSelf='center' variant='h6'>/</Typography>
        <TextField
          label='Border'
          style={{width: 110}}
          value={border}
          onChange={evt => setBorder( evt.target.value )}
          onBlur={handleBorderBlur}
          InputProps={{endAdornment: <InputAdornment position='end'>{isPercent ? '%' : 'in'}</InputAdornment>}}
        />
      </Stack>

      {shapeType && (
        <Typography variant='caption' color='text.secondary'>
          {shapeTypeLabel( shapeType )} constrains width/height to a fixed aspect ratio.
        </Typography>
      )}
      {isPercent && (
        <Typography variant='caption' color='text.secondary'>
          This product has an explicit inside contour, so border above scales it instead of offsetting a constant
          distance: 100% is its original size, below 100% narrows the border, above 100% widens it.
        </Typography>
      )}
    </Stack>
  )
}
