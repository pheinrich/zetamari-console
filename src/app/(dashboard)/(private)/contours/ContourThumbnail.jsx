// Purely presentational - renders a precomputed thumbnail ({svgData,
// viewBox, strokeWidth} from contourThumbnail.js's computeContourThumbnail,
// run server-side). Deliberately does not import @/libs/mirror itself, so
// this stays safe to use from a 'use client' table without pulling the
// jsts-based geometry library into the client bundle.
export default function ContourThumbnail( {thumbnail, size = 40} )
{
  if( !thumbnail )
    return null

  return (
    <svg width={size} height={size} viewBox={thumbnail.viewBox} className='shrink-0'>
      <path
        fill='none'
        stroke='currentColor'
        strokeWidth={thumbnail.strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
        d={thumbnail.svgData}
      />
    </svg>
  )
}
