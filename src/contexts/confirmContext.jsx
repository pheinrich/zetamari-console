'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// An MUI stand-in for the browser's native window.confirm(), which this
// app never uses. useConfirm() returns a confirm( message, options ) that
// resolves true/false once the user picks a button (Escape or a backdrop
// click counts as cancel), so a call site reads
//
//   if( !await confirm( 'Remove this source?', {confirmText: 'Remove', destructive: true} ) )
//     return
//
// options: title, confirmText (default 'Confirm'), cancelText (default
// 'Cancel'), destructive (paints the confirm button in the error color).
const ConfirmContext = createContext( null )

export function ConfirmProvider( {children} )
{
  const [state, setState] = useState( null )
  const resolverRef = useRef( null )

  const confirm = useCallback( ( message, options = {} ) => new Promise( resolve => {
    // A second confirm() while one is open cancels the first rather than
    // leaving its promise dangling.
    resolverRef.current?.( false )
    resolverRef.current = resolve
    setState( {message, ...options} )
  } ), [] )

  function close( result )
  {
    resolverRef.current?.( result )
    resolverRef.current = null
    setState( prev => prev && {...prev, open: false} )
  }

  const open = Boolean( state ) && false !== state.open

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={open}
        onClose={() => close( false )}
        maxWidth='xs'
        fullWidth
        closeAfterTransition={false}
        TransitionProps={{onExited: () => setState( null )}}
      >
        {state?.title && <DialogTitle>{state.title}</DialogTitle>}
        <DialogContent className={state?.title ? undefined : 'pbs-6'}>
          <DialogContentText>{state?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => close( false )}>
            {state?.cancelText || 'Cancel'}
          </Button>
          <Button
            variant='contained'
            color={state?.destructive ? 'error' : 'primary'}
            onClick={() => close( true )}
            autoFocus
          >
            {state?.confirmText || 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm()
{
  const confirm = useContext( ConfirmContext )

  if( !confirm )
    throw new Error( 'useConfirm() must be used inside <ConfirmProvider>' )

  return confirm
}
