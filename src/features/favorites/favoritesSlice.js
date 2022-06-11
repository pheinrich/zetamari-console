import { createSlice } from '@reduxjs/toolkit'

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    shapes: new Set(),
    products: new Set()
  },
  reducers: {
    favoriteShape: (state, action) => {
      state.shapes = new Set( [...state.shapes, action.payload] )
    },
    unfavoriteShape: (state, action) => {
      state.shapes = new Set( [...state.shapes].filter( match => match !== action.payload ) )
    },
    favoriteProduct: (state, action) => {
      state.products = new Set( [...state.products, action.payload] )
    },
    unfavoriteProduct: (state, action) => {
      state.products = new Set( [...state.products].filter( match => match !== action.payload ) )
    }
  }
})

export const {
  favoriteShape, unfavoriteShape,
  favoriteProduct, unfavoriteProduct
} = favoritesSlice.actions

export const selectFavoriteShapes = (state) => state.favorites.shapes
export const selectFavoriteProducts = (state) => state.favorites.products

export default favoritesSlice.reducer