import React from "react"
import { Shape } from "src/modules/shape.mjs"

function MirrorView ( {shape, zoom = 65, showGlass = true, showBack = false, showDims = 0} ) {

	const origin = shape.getOrigin();
	const viewBox = `${origin.x - (110 - zoom)/2} ${origin.y - (110 - zoom)/2} ${110 - zoom} ${110 - zoom}`
	const substrateSVG = `${shape.outside.getSVGData()} ${shape.inside.getSVGData()}`
	const rabbetSVG = shape.rabbet.getSVGData()
  const mirrorSVG = shape.mirror.getSVGData()
  const size = {dx: shape.width, dy: shape.height}
  const sz = {x: 110 - zoom, y: 110 - zoom }
  const pix = {x: size.dx * 500 / sz.x, y: size.dy * 500 / sz.y}

  const extremes = shape.outside.getExtremes();
  const limits = {
    left: 250 - pix.y/2 + (pix.y * (extremes.left.y - extremes.top.y) / size.dy) - 10,
    right: 250 - pix.y/2 + (pix.y * (extremes.right.y - extremes.top.y) / size.dy) - 10,
    top: 250 - pix.x/2 + (pix.x * (extremes.top.x - extremes.left.x) / size.dx) + 10,
    bottom: 250 - pix.x/2 + (pix.x * (extremes.bottom.x - extremes.left.x) / size.dx) + 10
  }

  if( showBack ) {
    limits.top = 250 + pix.x/2 - (pix.x * (extremes.top.x - extremes.left.x) / size.dx) + 10
    limits.bottom = 250 + pix.x/2 - (pix.x * (extremes.bottom.x - extremes.left.x) / size.dx) + 10
  }

	return (
    <div
      style={{position: 'relative', top: 0, left: 0, border: '1px solid black', width: 500, height: 500}}
    >
  		<svg
        style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
  		  version="1.1"
        xmlns="http://www.w3.org/2000/svg"
  		  xmlnsXlink="http://www.w3.org/1999/xlink"
        id="svg"
        width="500"
        height="500"
        viewBox={viewBox}
        transform={showBack && "scale(-1 1)"}
      >
        <defs>
          <linearGradient id="mirrorBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bbb" stopOpacity="1" />
            <stop offset="100%" stopColor="#aaa" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="mirrorFrontGrad" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#aaa" stopOpacity="1" />
            <stop offset="55%" stopColor="#eee" stopOpacity="1" />
            <stop offset="60%" stopColor="#eee" stopOpacity="1" />
            <stop offset="100%" stopColor="#bbb" stopOpacity="1" />
          </linearGradient>
        </defs>

        { showBack && <path
          id="outside"
          fill="#eda"
          strokeWidth="0.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="1"
          stroke="#000"
          d={substrateSVG}
        />}

        { showGlass && <path
          id="mirror"
          fill={showBack ? "url(#mirrorBackGrad)" : "url(#mirrorFrontGrad)"}
          strokeWidth="0.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="1"
          stroke="#888"
          d={mirrorSVG}
        />}

        { showBack && <path
          id="rabbet"
          fill="none"
          strokeWidth="0.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="1"
          stroke="#444"
          d={rabbetSVG}
        />}

        { !showBack && <path
          id="outside"
          fill="#eda"
          strokeWidth="0.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="1"
          stroke="#000"
          d={substrateSVG}
        />}
      </svg>

      { showDims > 0 && <svg
        style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        id="svg"
        width="500"
        height="500"
        viewBox="0 0 500 500"
      >
        <defs>
          <marker id="arrow" orient="auto" markerWidth="10" markerHeight="6" refX="1" refY="3">
            <path d="M0,0 V6 L10,3 Z" fill="red"/>
          </marker>
        </defs>

        { (showDims & 1) === 1 && <g fill="none">
          <line
            strokeWidth="0.5"
            stroke="red"
            x1={250 - pix.x/2 - 45} y1={250 - pix.y/2 - 2}
            x2={limits.top} y2={250 - pix.y/2 - 2}
          />
          <line
            strokeWidth="0.5"
            stroke="red"
            x1={250 - pix.x/2 - 45} y1={250 + pix.y/2 + 2}
            x2={limits.bottom} y2={250 + pix.y/2 + 2}
          />
          { pix.y > 81 && <line
            markerEnd="url(#arrow)"
            strokeWidth="2.5"
            fill="none"
            stroke="red"
            x1={250 - pix.x/2 - 35} y1="265"
            x2={250 - pix.x/2 - 35} y2={250 + pix.y/2 - 20}
          />}
          <text
            x={250 - pix.x/2 - 35} y="250"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
          >
            {size.dy.toFixed( 1 )}"
          </text>
          { pix.y > 81 && <line
            markerEnd="url(#arrow)"
            strokeWidth="2.5"
            fill="none"
            stroke="red"
            x1={250 - pix.x/2 - 35} y1="235"
            x2={250 - pix.x/2 - 35} y2={250 - pix.y/2 + 20}
          />}
          <line
            strokeWidth='0.5'
            stroke="red"
            x1={250 - pix.x/2 - 2} y1={250 + pix.y/2 + 45}
            x2={250 - pix.x/2 - 2} y2={limits.left}
          />
          <line
            strokeWidth="0.5"
            stroke="red"
            x1={250 + pix.x/2 + 2} y1={250 + pix.y/2 + 45}
            x2={250 + pix.x/2 + 2} y2={limits.right}
          />
          { pix.x > 100 && <line
            markerEnd="url(#arrow)"
            strokeWidth="2.5"
            fill="none"
            stroke="red"
            y1={250 + pix.y/2 + 35} x1="275"
            y2={250 + pix.y/2 + 35} x2={250 + pix.x/2 - 20}
          />}
          <text
            y={250 + pix.y/2 + 35} x="250"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
          >
            {size.dx.toFixed( 1 )}"
          </text>
          { pix.x > 100 && <line
            markerEnd="url(#arrow)"
            strokeWidth="2.5"
            fill="none"
            stroke="red"
            y1={250 + pix.y/2 + 35} x1="225"
            y2={250 + pix.y/2 + 35} x2={250 - pix.x/2 + 20}
          />}
        </g>}
      </svg>}
    </div>
	)
}

export default MirrorView
