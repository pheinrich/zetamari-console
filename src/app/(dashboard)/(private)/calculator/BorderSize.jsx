// `width`/`height` (the numeric props, defaulting to 500) only size this
// SVG's *coordinate system* via viewBox, not its own rendered box - see
// Dimensions.jsx's doc comment for the full rationale (same overlay-on-
// top-of-MirrorView pattern, same fix).
export default function BorderSize( {fixed, max, min, width = 500, height = 500} )
{
 return (
    <svg
      style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, fontFamily: 'sans-serif'}}
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='100%'
      height='100%'
      viewBox={`0 0 ${width} ${height}`}
    >
      { fixed !== null && <>
        <text x={width - 10} y={height - 15} dominantBaseline='middle' textAnchor='end' fill='black'>
          Border Size: {fixed}&rdquo;
        </text>
      </>}
      { fixed === null && <>
        <text x={width - 10} y={height - 15} dominantBaseline='middle' textAnchor='end' fill='black'>
          Border Size: {min.toFixed( 1 )}&rdquo; &ndash; {max.toFixed( 1 )}&rdquo;
        </text>
      </>}
    </svg>
  )
}
