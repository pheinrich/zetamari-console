import Link from 'next/link'
import { readContours } from '@/db/actions/contour'

export default async function ContoursPage()
{
  const contours = await readContours()

  function truncate( str, maxLen )
  {
    if( !str || str.length <= maxLen )
      return str
    else
      return str.slice( 0, maxLen - 3 ) + "..."
  }

  return (
    <div>
      <h1>Contours List</h1>
      <ul>
        {contours.map( contour => (
          <li key={contour.id}>
            [{contour.id}] <Link href={`/contours/${contour.id}`}>{contour.name}</Link>: {truncate( contour.svgData, 50 )}
          </li>
        ))}
      </ul>
    </div>
  )
}
