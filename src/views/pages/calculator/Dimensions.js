import React from "react"
import { Shape } from "src/modules/polygon.mjs"

function Dimensions ( {polygon, zoom = 65, isFlipped = false, color = "red", width = 500, height = 500} ) {

	const arrow = `${color}-arrow`
	const dims = polygon.getDims()
  const mag = { x: 110 - zoom, y: 110 - zoom }
  const pix = { x: dims.width * width / mag.x, y: dims.height * height / mag.y }

  const limits = {
    left: height/2 - pix.y/2 + (pix.y * (dims.left.y - dims.top.y) / dims.height) - 10,
    right: height/2 - pix.y/2 + (pix.y * (dims.right.y - dims.top.y) / dims.height) - 10,
    top: width/2 - pix.x/2 + (pix.x * (dims.top.x - dims.left.x) / dims.width) + 10,
    bottom: width/2 - pix.x/2 + (pix.x * (dims.bottom.x - dims.left.x) / dims.width) + 10
  }

  if( isFlipped ) {
    limits.top = width/2 + pix.x/2 - (pix.x * (dims.top.x - dims.left.x) / dims.width) + 10
    limits.bottom = width/2 + pix.x/2 - (pix.x * (dims.bottom.x - dims.left.x) / dims.width) + 10
  }

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

        <g fill="none">
          <line
            strokeWidth="0.5"
            stroke={color}
            x1={width/2 - pix.x/2 - 45} y1={height/2 - pix.y/2 - 2}
            x2={limits.top} y2={height/2 - pix.y/2 - 2}
          />
          <line
            strokeWidth="0.5"
            stroke={color}
            x1={width/2 - pix.x/2 - 45} y1={height/2 + pix.y/2 + 2}
            x2={limits.bottom} y2={height/2 + pix.y/2 + 2}
          />
          { pix.y > 81 && <line
            markerEnd={`url(#${arrow})`}
            strokeWidth="2.5"
            fill="none"
            stroke={color}
            x1={width/2 - pix.x/2 - 35} y1={height/2 + 15}
            x2={width/2 - pix.x/2 - 35} y2={height/2 + pix.y/2 - 20}
          />}
          <text
            x={width/2 - pix.x/2 - 35} y={height/2}
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
          >
            {dims.height.toFixed( 1 )}"
          </text>
          { pix.y > 81 && <line
            markerEnd={`url(#${arrow})`}
            strokeWidth="2.5"
            fill="none"
            stroke={color}
            x1={width/2 - pix.x/2 - 35} y1={height/2 - 15}
            x2={width/2 - pix.x/2 - 35} y2={height/2 - pix.y/2 + 20}
          />}
          <line
            strokeWidth='0.5'
            stroke={color}
            x1={width/2 - pix.x/2 - 2} y1={height/2 + pix.y/2 + 45}
            x2={width/2 - pix.x/2 - 2} y2={limits.left}
          />
          <line
            strokeWidth="0.5"
            stroke={color}
            x1={width/2 + pix.x/2 + 2} y1={height/2 + pix.y/2 + 45}
            x2={width/2 + pix.x/2 + 2} y2={limits.right}
          />
          { pix.x > 100 && <line
            markerEnd={`url(#${arrow})`}
            strokeWidth="2.5"
            fill="none"
            stroke={color}
            y1={height/2 + pix.y/2 + 35} x1={width/2 + 25}
            y2={height/2 + pix.y/2 + 35} x2={width/2 + pix.x/2 - 20}
          />}
          <text
            y={height/2 + pix.y/2 + 35} x={width/2}
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
          >
            {dims.width.toFixed( 1 )}"
          </text>
          { pix.x > 100 && <line
            markerEnd={`url(#${arrow})`}
            strokeWidth="2.5"
            fill="none"
            stroke={color}
            y1={height/2 + pix.y/2 + 35} x1={width/2 - 25}
            y2={height/2 + pix.y/2 + 35} x2={width/2 - pix.x/2 + 20}
          />}
        </g>
      </svg>
  )
}

export default Dimensions
