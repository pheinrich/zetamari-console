'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function ActionButton( {action, id, label, labelPending, targetUrl, confirmMsg, successMsg, failMsg} )
{
  const formRef = useRef( null )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick()
  {
    const confirmed = confirm( confirmMsg )
    if( !confirmed )
      return

    const form = formRef.current
    if( !form )
      return;

    const formData = new FormData( form )

    startTransition( async () => {
      try
      {
        await action( formData )
        toast.success( successMsg )
        router.push( targetUrl )
      }
      catch( err )
      {
        toast.error( failMsg )
      }
    })
  }

  return (
    <form ref={formRef}>
      <input type='hidden' name='id' value={id} />
      <button
        type='button'
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? labelPending : label}
      </button>
    </form>
  )
}