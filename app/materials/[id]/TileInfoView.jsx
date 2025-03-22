import Link from 'next/link'

export default async function TileInfoView( {tileInfo} )
{
  return (
    <>
      Color: {tileInfo.color}<br/>
      Width: {tileInfo.width}<br/>
      Height: {tileInfo.height}<br/>
      Depth: {tileInfo.depth}
    </>
  )
}
