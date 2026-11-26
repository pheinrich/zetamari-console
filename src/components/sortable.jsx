'use client'

import { useMemo, useState } from 'react'

import classnames from 'classnames'

// Column sorting for the hand-built tables (those not on TanStack Table):
// `accessors` maps each sortable column id to a function giving a row's
// value. Clicking a header sorts by it ascending, again descending.
// Strings compare naturally ('A2' before 'A10'); empty values go last.
//
//   const {sorted, sort, onSort} = useSort( lines, {sku: l => l.Product?.sku, ...} )
//   <SortHeader id='sku' sort={sort} onSort={onSort}>SKU</SortHeader>
export function useSort( rows, accessors, initial = {id: 'sku', desc: false} )
{
  const [sort, setSort] = useState( initial )

  const sorted = useMemo( () => {
    const get = accessors[sort.id]

    if( !get )
      return rows

    const sign = sort.desc ? -1 : 1

    return [...rows].sort( (a, b) => {
      const x = get( a ), y = get( b )
      const xEmpty = x === null || x === undefined || x === '', yEmpty = y === null || y === undefined || y === ''

      if( xEmpty || yEmpty )
        return xEmpty - yEmpty   // empty last, whichever the direction

      const order = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String( x ).localeCompare( String( y ), undefined, {numeric: true, sensitivity: 'base'} )

      return sign * order
    } )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort] )

  const onSort = id => setSort( s => ({id, desc: s.id === id ? !s.desc : false}) )

  return {sorted, sort, onSort}
}

// A <th> that sorts its column, with the arrow the TanStack tables show
export function SortHeader( {id, sort, onSort, className, children} )
{
  const active = sort.id === id

  return (
    <th className={className} aria-sort={active ? (sort.desc ? 'descending' : 'ascending') : undefined}>
      <div
        className={classnames( 'cursor-pointer select-none', {'flex items-center': active, 'justify-center': active && className?.includes( 'text-center' )} )}
        onClick={() => onSort( id )}
      >
        {children}
        {active && <i className={sort.desc ? 'ri-arrow-down-s-line text-xl' : 'ri-arrow-up-s-line text-xl'} />}
      </div>
    </th>
  )
}
