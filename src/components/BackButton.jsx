'use client'

import { useRouter } from 'next/navigation'

export default function BackButton( {label} )
{
  const router = useRouter()

  function handleClick()
  {
    router.back()
  }

  return (
    <button onClick={handleClick}>{label}</button>
  )
}