export default function BorderSize( {fixed, max, min, width = 500, height = 500} )
{
 return (
    <svg
      style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, fontFamily: 'sans-serif'}}
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
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
