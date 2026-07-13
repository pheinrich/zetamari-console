'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { encodePanels } from './urlCodec'
import CalculatorPanel from './CalculatorPanel'
import ComparisonTable from './ComparisonTable'

// The board: owns the list of open panels and keeps the URL in sync for
// bookmarking/sharing. Each CalculatorPanel is independent (its own
// substrateInfo state, its own memoized mirror) - this component never
// computes geometry itself, it only aggregates each panel's reported
// {label, mirror} for the shared ComparisonTable.
export default function MirrorCalculator( {initialPanels, contours, substrateProducts} )
{
  // Ids are assigned once, deterministically, from the initial (server-
  // decoded) panels array - safe for SSR/hydration since both server and
  // client process the same initialPanels in the same order. Panels added
  // later (via "Add Panel") only ever happen post-hydration, so a plain
  // incrementing ref is fine for those.
  const [panels, setPanels] = useState( () => initialPanels.map( (p, i) => ({...p, id: `panel-${i}`}) ) )
  const nextIdRef = useRef( initialPanels.length )

  // id -> {label, mirror}, reported up by each CalculatorPanel whenever its
  // own geometry recomputes. Feeds the ComparisonTable.
  const [resolved, setResolved] = useState( {} )

  const handleResolvedChange = useCallback( (id, data) => {
    setResolved( prev => ({...prev, [id]: data}) )
  }, [] )

  function addPanel()
  {
    const id = `panel-${nextIdRef.current}`
    nextIdRef.current += 1
    setPanels( prev => [...prev, {id, productId: undefined, width: undefined, height: undefined, border: undefined}] )
  }

  function removePanel( id )
  {
    setPanels( prev => (1 < prev.length ? prev.filter( p => p.id !== id ) : prev) )
    setResolved( prev => {
      const next = {...prev}
      delete next[id]
      return next
    })
  }

  function updatePanel( id, patch )
  {
    setPanels( prev => prev.map( p => (p.id === id ? {...p, ...patch} : p) ) )
  }

  // Keeps ?panels= in sync so the current comparison (including any edits,
  // not just which products are tied) is bookmarkable/shareable. Uses the
  // raw History API rather than router.replace() deliberately - the latter
  // would re-run this page's Server Component and, since it's keyed on the
  // search params (see page.jsx), remount the whole board on every edit.
  useEffect( () => {
    const encoded = encodePanels( panels )
    const url = new URL( window.location.href )

    url.searchParams.delete( 'productId' )
    if( encoded )
      url.searchParams.set( 'panels', encoded )
    else
      url.searchParams.delete( 'panels' )

    window.history.replaceState( null, '', url.toString() )
  }, [panels] )

  if( 0 === contours.length )
  {
    return (
      <Card>
        <CardContent>
          <Typography>
            No contours exist yet. <NextLink href='/contours/new'>Create one</NextLink> (a basic circle/oval/
            rectangle/etc is enough to get started) before using the calculator.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const resolvedPanels = panels.map( p => ({
    id: p.id,
    label: resolved[p.id]?.label ?? '…',
    mirror: resolved[p.id]?.mirror,
  }) )

  return (
    <Card>
      <CardHeader
        title='Mirror Calculator'
        subheader='Add panels to compare shapes and dimensions side by side.'
        action={
          <Button variant='contained' onClick={addPanel} startIcon={<i className='ri-add-line' />}>
            Add Panel
          </Button>
        }
      />
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-start gap-6'>
          {panels.map( p => (
            <CalculatorPanel
              key={p.id}
              spec={p}
              contours={contours}
              substrateProducts={substrateProducts}
              onChange={updatePanel}
              onRemove={removePanel}
              onResolvedChange={handleResolvedChange}
              canRemove={1 < panels.length}
            />
          ) )}
        </div>

        <Divider />

        <ComparisonTable panels={resolvedPanels} />
      </CardContent>
    </Card>
  )
}
