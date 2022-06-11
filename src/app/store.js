import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from '../features/favorites/favoritesSlice'
import searchReducer from '../features/search/searchSlice'

export default configureStore({
    reducer: {
      favorites: favoritesReducer,
      search: searchReducer
    }
  })
