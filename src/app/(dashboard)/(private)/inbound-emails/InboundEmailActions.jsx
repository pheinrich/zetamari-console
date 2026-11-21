'use client'

import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { deleteInboundEmail, reprocessInboundEmail, undoInboundEmail } from '@/db/actions/channelOrder'

// One action as a labelled button, or (compact) an icon with a tooltip.
function Action( {compact, size, label, icon, color, disabled, onClick} )
{
  if( compact )
    return (
      <Tooltip title={label}>
        <span>
          <IconButton size='small' color={color} disabled={disabled} onClick={onClick} aria-label={label}>
            <i className={`${icon} text-[22px]`} />
          </IconButton>
        </span>
      </Tooltip>
    )

  return (
    <Button size={size} variant='outlined' color={color} disabled={disabled} onClick={onClick} startIcon={<i className={icon} />}>
      {label}
    </Button>
  )
}

// Undo/redo of one email's parsing (see the actions' doc comments).
// Undo is offered only once something has been done with the email;
// reparse always, since it's how a fixed parser is applied to old mail.
// `afterUndoHref` is where to go after an undo, when the current page may
// no longer exist (a channel order deleted along with its only email).
// `compact` shows icon buttons, for the inbound emails list. Delete is
// offered on the inbound email pages (`deletable`), not where the email is
// shown as part of a channel order; `afterDeleteHref` is where to go after
// deleting, when the current page is the email's own.
export default function InboundEmailActions( {email, size = 'medium', afterUndoHref, compact = false, deletable = false, afterDeleteHref} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState( false )

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

  function handleDelete()
  {
    startTransition( async () => {
      const result = await deleteInboundEmail( email.id )

      if( result.error )
        toast.error( `Couldn't delete: ${result.error}` )
      else
      {
        toast.success( 'Email deleted' )
        setConfirmDelete( false )
        afterDeleteHref ? router.push( afterDeleteHref ) : router.refresh()
      }
    } )
  }

  return (
    <div className={compact ? 'flex flex-nowrap gap-1' : 'flex flex-wrap gap-2'} onClick={e => e.stopPropagation()}>
      {email.status !== 'received' && (
        <Action compact={compact} size={size} label='Undo parse' icon='ri-arrow-go-back-line' color='secondary' disabled={isPending} onClick={handleUndo} />
      )}
      <Action
        compact={compact}
        size={size}
        label={email.status === 'received' ? 'Parse' : 'Reparse'}
        icon='ri-refresh-line'
        color='primary'
        disabled={isPending}
        onClick={handleReparse}
      />
      {deletable && (
        <>
          <Action compact={compact} size={size} label='Delete' icon='ri-delete-bin-7-line' color='error' disabled={isPending} onClick={() => setConfirmDelete( true )} />
          <Dialog fullWidth maxWidth='xs' open={confirmDelete} onClose={() => !isPending && setConfirmDelete( false )} closeAfterTransition={false}>
            <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
              <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
              <Typography variant='h4'>Delete this email?</Typography>
              <Typography color='text.primary' className='mbs-2'>{email.subject || '(no subject)'}</Typography>
              <Typography color='text.secondary' className='mbs-2'>
                {email.channelOrderId
                  ? 'The stored email is removed for good, along with its channel order unless another email also feeds it.'
                  : 'The stored email is removed for good.'}
              </Typography>
            </DialogContent>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
              <Button variant='contained' color='error' disabled={isPending} onClick={handleDelete}>
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button variant='outlined' color='secondary' disabled={isPending} onClick={() => setConfirmDelete( false )}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  )
}
