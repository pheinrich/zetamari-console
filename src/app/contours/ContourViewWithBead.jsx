import { buildFromSVGData, buildFromType, getDims, getSVGData } from '@/lib/mirror'
import { subdividePath } from '@/lib/kit'

export default async function ContourViewWithBead( {contour} )
{
  const geometry = contour.svgData ? buildFromSVGData( contour.svgData ) : buildFromType( contour.id, 20, 32.4 )
//  const svgData = contour.svgData || getSVGData( geometry )
  const svgData = subdividePath( geometry )
  const dims = getDims( geometry )

  const center = dims.center
  const zoom = 65
  const viewBox = `${center.x - zoom/2} ${center.y - zoom/2} ${zoom} ${zoom}`

  return (
    <>
      <div>
        <h1>Contour: {contour.name}</h1>
        <textarea rows='10' cols='120' defaultValue={svgData} />
      </div>
      <div
        style={{
          position: 'relative',
          boxSizing: 'content-box',
          top: 0,
          left: 0,
          border: '1px solid black',
          width: 500,
          height: 500}}
      >
        <svg
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='500'
          height='500'
          viewBox={viewBox}
        >
          <defs>
            <marker
              id='bead-marker'
              viewBox='0 0 500 500'
              refX='20'
              refY='20'
              markerUnits='userSpaceOnUse'
              markerWidth='20'
              markerHeight='20'
              orient='auto'
              fill='#f88'
            >
              <path d='M0 0 10 0 20 10 10 20 0 20 10 10Z' />
            </marker>
          </defs>

          <path
            fill='none'
            stroke='#666'
            strokeWidth='0.25'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeOpacity='1'
            markerStart='url(#bead-marker)'
            markerEnd='url(#bead-marker)'
            markerMid='url(#bead-marker)'
            d={svgData}
          />
        </svg>
      </div>
    </>
  )
}