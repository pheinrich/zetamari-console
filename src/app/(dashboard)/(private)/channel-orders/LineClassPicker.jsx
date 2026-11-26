'use client'

import { useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { matchChannelOrderLineClass } from '@/db/actions/channelOrder'

// The "Product" cell of a class-seat Channel Order Line (a class bought
// on Squarespace - see libs/channelOrders/classSeats.js): the Live Class
// it's for, matched on arrival by the class's date, or "no class" - and,
// while the order is under review, a picker of recent and upcoming
// classes to match it by hand. Once accepted, how many seats it enrolled.
export default function LineClassPicker( {line, classes, editable} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState( false )
  const [choice, setChoice] = useState( null )
  const current = classes.find( c => c.id === line.liveClassId )

  function save( liveClassId )
  {
    startTransition( async () => {
      const result = await matchChannelOrderLineClass( line.id, liveClassId )

      if( result.error )
        return toast.error( result.error )

      toast.success( liveClassId ? 'Matched to the class' : 'Unmatched' )
      setEditing( false )
      setChoice( null )
      router.refresh()
    } )
  }

  if( !editing )
    return (
      <div className='flex flex-wrap items-center gap-1'>
        <Chip size='small' variant='tonal' color='info' label='class seats' />
        {line.liveClassId
          ? <Link href={`/live-classes/${line.liveClassId}`}>{current?.label ?? line.LiveClass?.name ?? `Class #${line.liveClassId}`}</Link>
          : <Chip size='small' variant='tonal' color='warning' label='no class matched' />}
        {line.seatCount > 0 && <Chip size='small' variant='tonal' color='success' label={`${line.seatCount} enrolled`} />}
        {editable && (
          <Tooltip title={line.liveClassId ? 'Change class' : 'Match to a class'}>
            <IconButton size='small' onClick={() => setEditing( true )}>
              <i className={line.liveClassId ? 'ri-pencil-line' : 'ri-links-line'} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    )

  return (
    <div className='flex flex-col gap-1' style={{minInlineSize: 340}}>
      <Autocomplete
        size='small'
        options={classes}
        value={choice}
        onChange={(e, value) => setChoice( value )}
        getOptionLabel={o => o.label}
        getOptionKey={o => o.id}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        openOnFocus
        renderInput={params => <TextField {...params} autoFocus placeholder='Search classes' />}
      />
      <div className='flex gap-2'>
        <Button size='small' variant='contained' disabled={!choice || isPending} onClick={() => save( choice.id )}>Match</Button>
        {line.liveClassId && <Button size='small' color='warning' disabled={isPending} onClick={() => save( null )}>Unmatch</Button>}
        <Button size='small' color='secondary' disabled={isPending} onClick={() => { setEditing( false ); setChoice( null ) }}>Cancel</Button>
      </div>
    </div>
  )
}
