'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

import { advancePieces } from '@/db/actions/piece'
import { customerDisplayName } from '../customers/customerFormat'

// One card per Piece within a phase column. `selected`/`onToggle` back
// the column's checkbox-driven batch selection; the lone arrow icon
// advances just this one piece, matching CONTEXT.md's "click to
// advance one Piece or a batch selection" (this session's grill Q3).
function PieceCard( {piece, selected, onToggle, onAdvance, disabled} )
{
  return (
    <div className='flex items-center gap-2 p-3 border rounded'>
      <Checkbox size='small' checked={selected} onChange={() => onToggle( piece.id )} disabled={disabled} />
      <div className='flex flex-col grow min-is-0'>
        <Typography className='font-medium' noWrap>{piece.Product?.name}</Typography>
        <Typography variant='body2' color='text.secondary'>
          <Link href={`/orders/${piece.Order?.id}`}>#{piece.Order?.id}</Link>
          {' · '}
          {customerDisplayName( piece.Order?.Customer )}
        </Typography>
      </div>
      <IconButton size='small' onClick={() => onAdvance( [piece.id] )} disabled={disabled} title='Advance'>
        <i className='ri-arrow-right-line' />
      </IconButton>
    </div>
  )
}

export default function ProductionBoard( {columns} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedByPhase, setSelectedByPhase] = useState( {} )

  function toggle( phase, pieceId )
  {
    setSelectedByPhase( prev => {
      const current = new Set( prev[phase] ?? [] )
      if( current.has( pieceId ) )
        current.delete( pieceId )
      else
        current.add( pieceId )

      return {...prev, [phase]: current}
    } )
  }

  function advance( pieceIds )
  {
    if( !pieceIds.length )
      return

    startTransition( async () => {
      try
      {
        const result = await advancePieces( pieceIds )
        if( result?.advanced )
          toast.success( `Advanced ${result.advanced} piece${1 === result.advanced ? '' : 's'}` )
        else
          toast.info( 'Nothing to advance - already at the last phase' )

        setSelectedByPhase( {} )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to advance' )
      }
    })
  }

  return (
    <Grid container spacing={4}>
      {columns.map( ({phase, pieces}) => {
        const selected = selectedByPhase[phase] ?? new Set()

        return (
          <Grid key={phase} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className='h-full'>
              <CardHeader
                title={phase}
                action={<Chip label={pieces.length} variant='tonal' size='small' />}
              />
              <Divider />
              <CardContent className='flex flex-col gap-3'>
                <Button
                  size='small'
                  variant='outlined'
                  disabled={isPending || 0 === selected.size}
                  onClick={() => advance( [...selected] )}
                >
                  Advance Selected {selected.size > 0 ? `(${selected.size})` : ''}
                </Button>
                <div className='flex flex-col gap-2'>
                  {pieces.map( piece => (
                    <PieceCard
                      key={piece.id}
                      piece={piece}
                      selected={selected.has( piece.id )}
                      onToggle={id => toggle( phase, id )}
                      onAdvance={advance}
                      disabled={isPending}
                    />
                  ) )}
                  {0 === pieces.length && (
                    <Typography color='text.secondary' variant='body2'>No pieces</Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        )
      } )}
    </Grid>
  )
}
