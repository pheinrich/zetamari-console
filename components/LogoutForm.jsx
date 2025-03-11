'use client'

import { useSession, signOut } from 'next-auth/react'

export default function LogoutForm()
{
  const session = useSession()

  return (
    <>
      {session && <button onClick={() => signOut()}>Log Out</button>}
    </>
  )
}
