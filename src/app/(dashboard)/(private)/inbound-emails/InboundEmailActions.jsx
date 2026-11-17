'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { reprocessInboundEmail, undoInboundEmail } from '@/db/actions/channelOrder'

// Undo/redo of one email's parsing (see the actions' doc comments).
// Undo is offered only once something has been done with the email;
// reparse always, since it's how a fixed parser is applied to old mail.
// `afterUndoHref` is where to go after an undo, when the current page may
// no longer exist (a channel order deleted along with its only email).
export default function InboundEmailActions( {email, size = 'medium', afterUndoHref} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleReparse()
  {
    startTransition( async () => {
      const result = await reprocessInboundEmail( email.id )

      if( result.status === 'failed' )
        toast.error( `Parsing failed: ${result.error}` )
      else if( result.status === 'parsed' && !result.updated )
        toast.info( 'Parsed, but its channel order was already reviewed and was left unchanged' )
      else
        toast.success( result.status === 'parsed' ? 'Email reparsed' : `Email ${result.status}` )

      router.refresh()
    } )
  }

  function handleUndo()
  {
    const message = email.channelOrderId
      ? 'Undo parsing this email? Its channel order is deleted too, unless another email also feeds it.'
      : 'Undo processing this email? It goes back to "received".'

    if( !confirm( message ) )
      return

    startTransition( async () => {
      const result = await undoInboundEmail( email.id )

      if( result.error )
        toast.error( `Couldn't undo: ${result.error}` )
      else
      {
        toast.success( 'Email returned to received' )
        afterUndoHref ? router.push( afterUndoHref ) : router.refresh()
      }
    } )
  }

  return (
    <div className='flex flex-wrap gap-2' onClick={e => e.stopPropagation()}>
      {email.status !== 'received' && (
        <Button size={size} variant='outlined' color='secondary' disabled={isPending} onClick={handleUndo} startIcon={<i className='ri-arrow-go-back-line' />}>
          Undo parse
        </Button>
      )}
      <Button size={size} variant='outlined' disabled={isPending} onClick={handleReparse} startIcon={<i className='ri-refresh-line' />}>
        {email.status === 'received' ? 'Parse' : 'Reparse'}
      </Button>
    </div>
  )
}
