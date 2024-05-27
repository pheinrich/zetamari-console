const OFFSET = 35   // Display distance from polygon
const PADDING = 10  // Extra spacing

function HorzLimitLine( {start, end, y, color} )
{
	return (
    <line
    	x1={start}
    	y1={y}
    	x2={end}
    	y2={y}
    	stroke={color}
    	strokeWidth='0.5'
    />
  )
}

function VertLimitLine( {start, end, x, color} )
{
	return (
    <line
    	x1={x}
    	y1={start}
    	x2={x}
    	y2={end}
    	stroke={color}
    	strokeWidth='0.5'
    />
   )
}

function ArrowHead( {start, end, color, marker} )
{
	return (
		<line
			x1={start.x} y1={start.y} x2={end.x} y2={end.y}
			stroke={color}
			strokeWidth='2.5'
			markerEnd={marker}
			fill='none'
		/>
	)
}

function Label( {x, y, value} )
{
	return (
    <text
    	x={x} y={y}
      dominantBaseline='middle'
      textAnchor='middle'
      fill='black'
    >
      {value.toFixed( 1 )}&rdquo;
    </text>
  )
}

function shapeToView( shape, origin, vw, vh, scale )
{
	{/* Map from object coordinates to viewport coordinates. */}
	
	return {
		x: ((shape.x - origin.x) * scale.x) + vw/2,
		y: ((shape.y - origin.y) * scale.y) + vh/2
	}
}

export default function Dimensions( {labelAnchor, dims, origin, zoom, isFlipped, color = "red", width = 500, height = 500} )
{
	const arrow = `${color}-arrow`
	const markerEnd = `url(#${arrow})`

	const scale = { x: width / (110 - zoom), y: height / (110 - zoom) }
	const top = shapeToView( dims.top, origin, width, height, scale )
	const right = shapeToView( dims.right, origin, width, height, scale )
	const bottom = shapeToView( dims.bottom, origin, width, height, scale )
	const left = shapeToView( dims.left, origin, width, height, scale )
	const label = shapeToView( labelAnchor, origin, width, height, scale )

	const offset = {x: label.x < right.x ? -OFFSET : OFFSET, y: label.y < bottom.y ? -OFFSET : OFFSET }
	const padding = {x: label.x < right.x ? -PADDING : PADDING, y: label.y < bottom.y ? -PADDING : PADDING }
	
  if( isFlipped )
  {
		top.x = width - top.x
		bottom.x = width - bottom.x
  }

	return (
		<svg
      style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <marker id={arrow} orient='auto' markerWidth='10' markerHeight='6' refX='1' refY='3'>
          <path d='M0,0 V6 L10,3 Z' fill={color}/>
        </marker>
      </defs>

			<HorzLimitLine start={label.x + offset.x + padding.x} end={top.x - padding.x} y={top.y - 2} color={color}/>
			<HorzLimitLine start={label.x + offset.x + padding.x} end={bottom.x - padding.x} y={bottom.y + 2} color={color}/>
			<VertLimitLine start={label.y + offset.y + padding.y} end={left.y - padding.y} x={left.x - 2} color={color} />
			<VertLimitLine start={label.y + offset.y + padding.y} end={right.y - padding.y} x={right.x + 2} color={color} />

      { 92 < (bottom.y - top.y) && <>
				<ArrowHead
					start={{x: label.x + offset.x, y: (top.y + bottom.y)/2 - 2*PADDING}}
					end={{x: label.x + offset.x, y: top.y + 2*PADDING}}
					color={color} marker={markerEnd}
				/>
				<ArrowHead
					start={{x: label.x + offset.x, y: (top.y + bottom.y)/2 + 2*PADDING}}
					end={{x: label.x + offset.x, y: bottom.y - 2*PADDING}}
					color={color} marker={markerEnd}
				/>
			</>}
      { 110 < (right.x - left.x) && <>
				<ArrowHead
					start={{x: (left.x + right.x)/2 - 3*PADDING, y: label.y + offset.y}}
					end={{x: left.x + 2*PADDING, y: label.y + offset.y}}
					color={color} marker={markerEnd}
				/>
				<ArrowHead
					start={{x: (left.x + right.x)/2 + 3*PADDING, y: label.y + offset.y}}
					end={{x: right.x - 2*PADDING, y: label.y + offset.y}}
					color={color} marker={markerEnd}
				/>
			</>}

     	<Label x={(left.x + right.x)/2} y={label.y + offset.y} value={dims.width} />
      <Label x={label.x + offset.x} y={(top.y + bottom.y)/2} value={dims.height} />
    </svg>
  )
}
