import Link from 'next/link'

export default async function TileInfoView( {tileInfo} )
{
  return (
    <>
      Color: {tileInfo.color}<br/>
      Width: {tileInfo.width} mm<br/>
      Height: {tileInfo.height} mm<br/>
      Thickness: {tileInfo.thickness} mm
    </>
  )
}
