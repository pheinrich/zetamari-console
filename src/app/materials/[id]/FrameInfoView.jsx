import Link from 'next/link'

export default async function FrameInfoView( {frameInfo} )
{
  return (
    <>
      Width: {frameInfo.width}<br/>
      Height: {frameInfo.height}<br/>
      Thickness: {frameInfo.thickness}<br/>
      Channel: {frameInfo.channel}<br/>
      Border: {frameInfo.border}<br/>
      Photo Width: {frameInfo.photoWidth}<br/>
      Photo Height: {frameInfo.photoHeight}<br/>
    </>
  )
}
