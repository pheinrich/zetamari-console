import React from 'react'
import { Shape } from 'src/modules/shape.mjs'
import Dimensions from 'src/views/pages/calculator/Dimensions.js'

function SVG( { fill, color, stroke, data } )
{
  return (
    <path
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeOpacity='1'
      d={data}
    />
  ) 
}

function MirrorView( {shape, zoom = 65, showGlass = true, showBack = false, showDims = 0} )
{
	const origin = shape.getOrigin();
	const viewBox = `${origin.x - (110 - zoom)/2} ${origin.y - (110 - zoom)/2} ${110 - zoom} ${110 - zoom}`
	const substrateSVG = `${shape.outside.getSVGData()} ${shape.inside.getSVGData()}`
	const rabbetSVG = shape.rabbet.getSVGData()
  const mirrorSVG = shape.mirror.getSVGData()

	return (
    <div
      style={{position: 'relative', top: 0, left: 0, border: '1px solid black', width: 500, height: 500}}
    >
  		<svg
        style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
  		  version='1.1'
        xmlns='http://www.w3.org/2000/svg'
  		  xmlnsXlink='http://www.w3.org/1999/xlink'
        width='500'
        height='500'
        viewBox={viewBox}
        transform={showBack && 'scale(-1 1)'}
      >
        <defs>
          <linearGradient id='mirrorBackGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#bbb' stopOpacity='1' />
            <stop offset='100%' stopColor='#aaa' stopOpacity='1' />
          </linearGradient>

          <linearGradient id='mirrorFrontGrad' x1='0%' y1='10%' x2='100%' y2='90%'>
            <stop offset='0%' stopColor='#aaa' stopOpacity='1' />
            <stop offset='55%' stopColor='#eee' stopOpacity='1' />
            <stop offset='60%' stopColor='#eee' stopOpacity='1' />
            <stop offset='100%' stopColor='#bbb' stopOpacity='1' />
          </linearGradient>
        </defs>

        { showBack && <SVG fill='#eda' stroke='0.1' color='#000' data={substrateSVG} />}
        { showGlass && <SVG
          fill={showBack ? 'url(#mirrorBackGrad)' : 'url(#mirrorFrontGrad)'}
          stroke='0.05'
          color='#888'
          data={mirrorSVG}
        />}
        { showBack ?
          <SVG fill='none' stroke='0.05' color='#444' data={rabbetSVG} />
          :
          <SVG fill='#eda' stroke='0.1' color='#000' data={substrateSVG} />
        }
      </svg>

      { (showDims & 1) === 1 && <Dimensions
        polygon={shape.outside}
        origin={origin}
        zoom={zoom}
        isFlipped={showBack}
        color='red'
      />}

      { (showDims & 2) === 2 && <Dimensions
        polygon={showBack && showGlass ? shape.mirror : shape.inside}
        origin={origin}
        zoom={zoom}
        isFlipped={showBack}
        color='blue'
      />}

    </div>
	)
}

export default MirrorView
