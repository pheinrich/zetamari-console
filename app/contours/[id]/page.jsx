import { notFound } from 'next/navigation'
import { readContour } from '@/db/actions/contour'
import { buildFromSVGData, getDims } from '@/lib/mirror'

export default async function ContourPage( {params} )
{
  const {id} = await params
  const contour = await readContour( id )

  if( !contour )
    return notFound()

  const geometry = buildFromSVGData( contour.svgData )
  const dims = getDims( geometry )

  console.log( dims )

  const center = dims.center
  const zoom = 65
  const viewBox = `${center.x - zoom/2} ${center.y - zoom/2} ${zoom} ${zoom}`

  return (
    <>
      <div>
        <h1>Contour: {contour.name}</h1>
        <textarea rows='10' cols='120' defaultValue={contour.svgData} />
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
          <path
            fill='none'
            stroke='#666'
            strokeWidth='0.25'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeOpacity='1'
            d={contour.svgData}
          />
        </svg>
      </div>
    </>
  )
}
