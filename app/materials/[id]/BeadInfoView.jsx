import Link from 'next/link'

export default async function BeadInfoView( {beadInfo} )
{
  return (
    <>
      Type: {beadInfo.type}<br/>
      Finish: {beadInfo.finish}<br/>
      Shape: {beadInfo.shape}<br/>
      Color: {beadInfo.color}<br/>
      Width: {beadInfo.width}<br/>
      Height: {beadInfo.height}<br/>
      Depth: {beadInfo.depth}
    </>
  )
}
