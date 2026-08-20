import { createSlice } from '@reduxjs/toolkit'

// Persists the Visualizer's working panel + lightbox gallery + pinned
// flag (backed by redux-persist/sessionStorage - see redux-store/index.js),
// so that navigating away via the sidebar/nav link (a plain /calculator
// href, no query string - see VerticalMenu.jsx/HorizontalMenu.jsx) and
// back doesn't lose it, the way it used to when the URL query string
// (see urlCodec.js) was the *only* persistence mechanism.
//
// The URL remains the primary, shareable mechanism for an explicit link
// (a bookmark, a shared URL, a product's "Open in Visualizer" button) -
// this snapshot is only consulted as a fallback when the incoming URL
// carries none of those params at all, so a fresh explicit link always
// wins over whatever happened to be open in this tab before - see
// MirrorCalculator.jsx's `fromExplicitLink` handling.
//
// Shape matches urlCodec's decoded {current, gallery, pinned, tabVisible,
// pricingColumnVisible} exactly (gallery entries have no `id` field -
// MirrorCalculator assigns those fresh on load, same as it does for a
// URL-decoded gallery) so the two sources are interchangeable at the
// point MirrorCalculator reads them. Per the 2026-08-19 persistence
// revision, `current`/each `gallery` entry also carries its own Pricing/
// Weight tab state (preset/include/pricingOverrides/weightOverrides) -
// still just plain JSON fields here, no shape change needed in this file
// itself.
const initialState = {
  snapshot: null,
}

export const visualizerSlice = createSlice({
  name: 'visualizer',
  initialState,
  reducers: {
    setVisualizerSnapshot: (state, action) => {
      state.snapshot = action.payload
    },
  },
})

export const { setVisualizerSnapshot } = visualizerSlice.actions
export default visualizerSlice.reducer
