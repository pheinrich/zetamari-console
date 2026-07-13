'use client'

import { useSelector, useDispatch } from 'react-redux'
import { setTableView } from '@/redux-store/slices/tableView'

// Persists a list table's view state (sorting, pagination, filters) in
// Redux (backed by redux-persist/sessionStorage - see redux-store/index.js)
// so navigating away from a list page and back doesn't reset it. `key` is
// a per-page string (e.g. 'products'); `defaults` is used the first time
// that key has never been stored.
//
//   const {view, updateView, onSortingChange, onPaginationChange} =
//     useTableViewState('products', {
//       sorting: [],
//       pagination: {pageIndex: 0, pageSize: 10},
//       globalFilter: '',
//       filters: {type: '', sellable: '', status: ''},
//     })
//
//   useReactTable({
//     state: {sorting: view.sorting, pagination: view.pagination, globalFilter: view.globalFilter},
//     onSortingChange,
//     onPaginationChange,
//     onGlobalFilterChange: value => updateView({globalFilter: value}),
//     ...
//   })
//
// `updateView` shallow-merges its argument into the stored view, so
// `updateView({sorting: next})` only touches `sorting`. `onSortingChange`/
// `onPaginationChange` are ready to hand straight to useReactTable - they
// resolve TanStack Table's "value or updater function" callback shape and
// persist the result under the matching field.
export function useTableViewState( key, defaults )
{
  const dispatch = useDispatch()
  const stored = useSelector( state => state.tableViewReducer[key] )

  // Shallow-merged (not replaced) so a key that's never been dispatched
  // yet (e.g. `filters` before any filter was touched) still falls back
  // to its default instead of being undefined.
  const view = { ...defaults, ...stored }

  function updateView( partial )
  {
    dispatch( setTableView( {key, view: partial} ) )
  }

  function resolveTableUpdate( field )
  {
    return updaterOrValue => {
      const next = typeof updaterOrValue === 'function' ? updaterOrValue( view[field] ) : updaterOrValue
      updateView( {[field]: next} )
    }
  }

  return {
    view,
    updateView,
    onSortingChange: resolveTableUpdate( 'sorting' ),
    onPaginationChange: resolveTableUpdate( 'pagination' ),
  }
}
