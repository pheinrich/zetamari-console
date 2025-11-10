import Link from 'next/link'

export default async function MillefioriInfoView( {millefioriInfo} )
{
  return (
    <>
      Shape: {millefioriInfo.shape}<br/>
      Color: {millefioriInfo.color}<br/>
      Length: {millefioriInfo.length}<br/>
      Width: {millefioriInfo.width}<br/>
      Height: {millefioriInfo.height}<br/>
    </>
  )
}
