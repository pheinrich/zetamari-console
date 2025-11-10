'use client'

import { useSession } from 'next-auth/react'
import { reverse } from '@/db/actions/contour'

export default function ReverseContourForm( {id} )
{
  // const session = useSession()

  // return (
  //   <>
  //     {session && <button onClick={() => reverse( id )}>Reverse Orientation</button>}
  //   </>
  // )
  return (
    <></>
  )
}
