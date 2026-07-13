// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

// Persisted per-page list-table view state (sorting, pagination,
// search/filter selections), keyed by an arbitrary string each page picks
// (e.g. 'products', 'contours'). Lets someone navigate away from a list
// page and back - or close the tab and come back later - without losing
// how they'd sorted/filtered/paged it.
const initialState = {}

export const tableViewSlice = createSlice({
  name: 'tableView',
  initialState,
  reducers: {
    // payload: {key, view} - view is shallow-merged into whatever's
    // already stored for that key, so callers can update just the piece
    // they own (e.g. just `sorting`) without clobbering the rest.
    setTableView: (state, action) => {
      const { key, view } = action.payload

      state[key] = { ...state[key], ...view }
    }
  }
})

export const { setTableView } = tableViewSlice.actions
export default tableViewSlice.reducer
