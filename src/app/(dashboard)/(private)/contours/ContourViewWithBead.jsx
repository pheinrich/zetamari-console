import TextField from '@mui/material/TextField'
import { buildFromSVGData, buildFromType, getDims } from '@/libs/mirror'
import { subdividePath } from '@/libs/kit'

// Rendered inside a Card by the caller, which supplies the "Contour"
// title - this only renders the SVG preview + raw path data, both using
// the same geometry logic as before this restyle (unchanged).
export default function ContourViewWithBead( {contour} )
{
  const geometry = contour.svgData ? buildFromSVGData( contour.svgData ) : buildFromType( contour.shapeType, 20, 32.4 )
  const svgData = subdividePath( geometry )
  const dims = getDims( geometry )

  const center = dims.center
  const zoom = 65
  const viewBox = `${center.x - zoom / 2} ${center.y - zoom / 2} ${zoom} ${zoom}`

  return (
    <div className='flex flex-col gap-6'>
      <div className='is-full bs-[500px] max-is-[500px] border rounded overflow-hidden'>
        <svg
          width='100%'
          height='100%'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
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

      <TextField
        label='Path Data'
        multiline
        minRows={4}
        maxRows={10}
        fullWidth
        value={svgData}
        slotProps={{input: {readOnly: true}}}
      />
    </div>
  )
}
