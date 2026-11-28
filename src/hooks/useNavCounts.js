'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { readNavCounts } from '@/db/actions/navCounts'

const POLL_MS = 60_000
const CHANGED = 'nav-counts-changed'

// Call after anything that may change what the menu bubbles count (an
// email's or Channel Order's status, a Shipment's step) so they re-count at once
// instead of on the next poll.
export function announceNavCountsChanged()
{
  window.dispatchEvent( new Event( CHANGED ) )
}

// The menu's bubbles: {receivedEmails, newChannelOrders, openShipments} - see
// readNavCounts(). Re-checked on every page change, on
// announceNavCountsChanged(), when the window regains focus, and once a
// minute - new mail arrives without anyone navigating.
export default function useNavCounts()
{
  const pathname = usePathname()
  const [counts, setCounts] = useState( {receivedEmails: 0, newChannelOrders: 0, openShipments: 0} )

  useEffect( () => {
    let live = true

    const refresh = () => readNavCounts().then( c => live && setCounts( c ), () => {} )

    refresh()

    const timer = setInterval( refresh, POLL_MS )

    window.addEventListener( 'focus', refresh )
    window.addEventListener( CHANGED, refresh )

    return () => {
      live = false
      clearInterval( timer )
      window.removeEventListener( 'focus', refresh )
      window.removeEventListener( CHANGED, refresh )
    }
  }, [pathname] )

  return counts
}
