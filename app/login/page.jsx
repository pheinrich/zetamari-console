"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage()
{
  const [email, setEmail] = useState( "" )
  const [password, setPassword] = useState( "" )
  const [error, setError] = useState( "" )
  const router = useRouter()

  const handleSubmit = async( e ) => {
    e.preventDefault()
    setError( "" )

    const result = await signIn( 'credentials', {
      email,
      password,
      redirect: false,
    })

    if( result?.error )
      setError( result.error )
    else
      router.push( '/dashboard' )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  )
}