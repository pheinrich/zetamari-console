import React from "react";

function MirrorView ( {outsidePath, insidePath, rabbetPath} ) {
	return (
		<svg
		  version="1.1"
      xmlns="http://www.w3.org/2000/svg"
		  xmlnsXlink="http://www.w3.org/1999/xlink"
      id="svg"
      width="500"
      height="500"
      viewBox="-37.50000000 -37.500000000 75.00000000 75.00000000"
    >
      <defs>
        <linearGradient id="mirrorGrad" x1="0%" y1="10%" x2="100%" y2="90%">
          <stop offset="0%" stopColor="#aaa" stopOpacity="1" />
          <stop offset="55%" stopColor="#eee" stopOpacity="1" />
          <stop offset="60%" stopColor="#eee" stopOpacity="1" />
          <stop offset="100%" stopColor="#bbb" stopOpacity="1" />
        </linearGradient>
      </defs>

      <path
      	id="outside"
      	fill="#eda"
      	strokeWidth="0.1"
      	strokeLinecap="round"
      	strokeLinejoin="round"
      	strokeOpacity="1"
      	stroke="#000"
      	d={outsidePath}
      />

      <path
      	id="inside"
      	fill="url(#mirrorGrad)"
      	strokeWidth="0.05"
      	strokeLinecap="round"
      	strokeLinejoin="round"
      	strokeOpacity="1"
      	stroke="#000"
      	d={insidePath}
      />

      <path
      	id="rabbet"
      	fill="none"
      	strokeWidth="0.05"
      	strokeLinecap="round"
      	strokeLinejoin="round"
      	strokeOpacity="1"
      	stroke="#999"
      	d={rabbetPath}
      />

    </svg>
	)
}

export default MirrorView
