import React from "react"
import { Shape } from "src/modules/polygon.mjs"

/* Display distance from polygon */
const OFFSET = 35   // Display distance from polygon
const PADDING = 10  // Extra spacing

function HorzLimitLine( { width, height, x, dx, dy, color } )
{
	const baseline = (height + dy) / 2 + (dy < 0 ? -2 : 2)
	return (
		<line
			strokeWidth="0.5"
			stroke={color}
			x1={(width - dx) / 2 - OFFSET - PADDING} y1={baseline}
			x2={x} y2={baseline}
		/>
   )
}

function VertLimitLine( { width, height, y, dx, dy, color } )
{
	const baseline = (width + dx) / 2 + (dx < 0 ? -2 : 2)
	return (
		<line
			strokeWidth="0.5"
			stroke={color}
			x1={baseline} y1={(height + dy)/2 + OFFSET + PADDING}
			x2={baseline} y2={y}
		/>
   )
}

function HorzArrow( { width, height, dx, dy, markerEnd, color } )
{
	const y = (height + dy) / 2 + (dy < 0 ? -OFFSET : OFFSET)
	const start = (width / 2) + (dx < 0 ? -OFFSET + PADDING : OFFSET - PADDING)
	const end = (width + dx) / 2 + 2*(dx < 0 ? PADDING : -PADDING)

	return (
		<line
			markerEnd={markerEnd}
			strokeWidth="2.5"
			fill='none'
			stroke={color}
			x1={start} y1={y}
			x2={end} y2={y}
		/>
	)
}

function VertArrow( { width, height, dx, dy, markerEnd, color } )
{
	const x = (width + dx) / 2 + (dx < 0 ? -OFFSET : OFFSET)
	const start = (height / 2) + (dy < 0 ? -OFFSET + 2*PADDING : OFFSET - 2*PADDING)
	const end = (height + dy) / 2 + 2*(dy < 0 ? PADDING : -PADDING)

	return (
		<line
			markerEnd={markerEnd}
			strokeWidth="2.5"
			fill='none'
			stroke={color}
			x1={x} y1={start}
			x2={x} y2={end}
		/>
	)
}

function Label( { x, y, value } )
{
	return(
    <text
    	x={x} y={y}
      dominantBaseline="middle"
      textAnchor="middle"
      fill="black"
    >
      {value.toFixed( 1 )}"
    </text>
  )
}

function Dimensions ( {polygon, zoom = 65, isFlipped = false, color = "red", width = 500, height = 500} )
{
	const dims = polygon.getDims()
	const dx = dims.width * width / (110 - zoom)
	const dy = dims.height * height / (110 - zoom)

  const limits = {
    left: (height - dy)/2 + (dy * (dims.left.y - dims.top.y) / dims.height) - 10,
    right: (height - dy)/2 + (dy * (dims.right.y - dims.top.y) / dims.height) - 10,
    top: (width - dx)/2 + (dx * (dims.top.x - dims.left.x) / dims.width) + 10,
    bottom: (width - dx)/2 + (dx * (dims.bottom.x - dims.left.x) / dims.width) + 10
  }

  if( isFlipped ) {
    limits.top = (width + dx)/2 - (dx * (dims.top.x - dims.left.x) / dims.width) + 10
    limits.bottom = (width + dx)/2 - (dx * (dims.bottom.x - dims.left.x) / dims.width) + 10
  }

	const arrow = `${color}-arrow`
	const markerEnd = `url(#${arrow})`

	return (
		<svg
      style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <marker id={arrow} orient="auto" markerWidth="10" markerHeight="6" refX="1" refY="3">
          <path d="M0,0 V6 L10,3 Z" fill={color}/>
        </marker>
      </defs>

    	/* limit lines */
      <HorzLimitLine width={width} height={height} x={limits.top} dx={dx} dy={-dy} color={color} />
      <VertLimitLine width={width} height={height} y={limits.right} dx={dx} dy={dy} color={color} />
      <HorzLimitLine width={width} height={height} x={limits.bottom} dx={dx} dy={dy} color={color} />
      <VertLimitLine width={width} height={height} y={limits.left} dx={-dx} dy={dy} color={color} />

      /* x-axis arrows */
      { dy > 100 && <>
      	<HorzArrow width={width} height={height} dx={-dx} dy={dy} markerEnd={markerEnd} color={color} />
      	<HorzArrow width={width} height={height} dx={dx} dy={dy} markerEnd={markerEnd} color={color} />
      </>}
      /* y-axis arrows */
      { dy > 81 && <>
      	<VertArrow width={width} height={height} dx={-dx} dy={-dy} markerEnd={markerEnd} color={color} />
      	<VertArrow width={width} height={height} dx={-dx} dy={dy} markerEnd={markerEnd} color={color} />
      </>}

      /* width and height dimensions */
     	<Label x={width / 2} y={(height + dy) / 2 + OFFSET} value={dims.width} />
      <Label x={(width - dx) / 2 - OFFSET} y={height/2} value={dims.height} />
    </svg>
  )
}

export default Dimensions
