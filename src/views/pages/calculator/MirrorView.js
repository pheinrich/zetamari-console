import React from "react"
import { Shape } from "src/modules/shape.mjs"

function MirrorView ( {shape, zoom = 65, showGlass = true, showBack = false, showScale = false} ) {

	const origin = shape.getOrigin();
	const viewBox = `${origin.x - (110 - zoom)/2} ${origin.y - (110 - zoom)/2} ${110 - zoom} ${110 - zoom}`
	const substrateSVG = `${shape.outside.getSVGData()} ${shape.inside.getSVGData()}`
	const rabbetSVG = shape.rabbet.getSVGData()
  const mirrorSVG = shape.mirror.getSVGData()

	return (
		<svg
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
	)
}

export default MirrorView
