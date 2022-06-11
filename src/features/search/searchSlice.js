import { createSlice } from '@reduxjs/toolkit'
import { mirror_shapes } from '../../common/mirror_shapes'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    matchShapes: [...mirror_shapes.allShapeNames],
    matchSizes: [...mirror_shapes.allSizeChips]
  },
  reducers: {
    matchAllShapes: state => {
      state.matchShapes = [...mirror_shapes.allShapeNames]
    },
    unmatchAllShapes: state => {
      state.matchShapes = []
    },
    matchShape: (state, action) => {
      if( !state.matchShapes.includes( action.payload ) )
        state.matchShapes = [...state.matchShapes, action.payload]
    },
    unmatchShape: (state, action) => {
      state.matchShapes = state.matchShapes.filter( match => match !== action.payload )
    },
    matchAllSizes: state => {
      state.matchSizes = [...mirror_shapes.allSizeChips]
    },
    unmatchAllSizes: state => {
      state.matchSizes = []
    },
    matchSize: (state, action) => {
      if( !state.matchSizes.includes( action.payload ) )
        state.matchSizes = [...state.matchSizes, action.payload]
    },
    unmatchSize: (state, action) => {
      state.matchSizes = state.matchSizes.filter( match => match !== action.payload )
    }
  }
})

export const {
  matchAllShapes, unmatchAllShapes,
  matchShape, unmatchShape,
  matchAllSizes, unmatchAllSizes,
  matchSize, unmatchSize
} = searchSlice.actions

export const selectMatchShapes = (state) => state.search.matchShapes
export const selectMatchSizes = (state) => state.search.matchSizes

export default searchSlice.reducer