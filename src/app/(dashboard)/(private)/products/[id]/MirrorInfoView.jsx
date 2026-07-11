import Link from 'next/link'

export default async function MirrorInfoView( {mirrorInfo} )
{
  return (
    <>
      Shape: {mirrorInfo.shape}<br/>
      Width: {mirrorInfo.width}<br/>
      Height: {mirrorInfo.height}<br/>
      Thickness: {mirrorInfo.thickness}<br/>
      Bevel: {mirrorInfo.bevel}<br/>
    </>
  )
}
