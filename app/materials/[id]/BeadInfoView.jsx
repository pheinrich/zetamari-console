import Link from 'next/link'

export default async function BeadInfoView( {beadInfo} )
{
  return (
    <>
      Category: {beadInfo.category}<br/>
      Finish: {beadInfo.finish}<br/>
      Shape: {beadInfo.shape}<br/>
      Color: {beadInfo.color}<br/>
      Length: {beadInfo.length}<br/>
      Height: {beadInfo.height}<br/>
      Thickness: {beadInfo.thickness}
    </>
  )
}
