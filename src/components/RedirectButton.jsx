'use client'

import { useRouter } from 'next/navigation'

export default function RedirectButton( {targetUrl, label} )
{
  const router = useRouter()

  function handleClick()
  {
    router.push( targetUrl )
  }

  return (
    <button onClick={handleClick}>{label}</button>
  )
}
