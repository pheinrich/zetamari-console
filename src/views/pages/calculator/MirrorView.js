import React from 'react'
import { Shape } from 'src/modules/shape.mjs'
import Dimensions from 'src/views/pages/calculator/Dimensions.js'

function MirrorView ( {shape, zoom = 65, showGlass = true, showBack = false, showDims = 0} ) {

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

      { (showDims & 1) === 1 && <Dimensions
        polygon={shape.outside}
        delta={{ x: -1, y: 1 }}
        zoom={zoom}
        isFlipped={showBack}
        color="red"
      />}

      { (showDims & 2) === 2 && <Dimensions
        polygon={shape.inside}
        delta={{ x: 1, y: -1 }}
        zoom={zoom}
        isFlipped={showBack}
        color="blue"
      />}

    </div>
	)
}

export default MirrorView
