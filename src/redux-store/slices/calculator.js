import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lightboxes: [],
  items: [],
  currentItemId: null
}

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState: initialState,
  reducers: {
    addLightbox: (state, action) => {
      const maxId = Math.max( 0, ...state.lightboxes.map( lightbox => lightbox.id ) )
      const newLightbox = {
        id: maxId + 1,
        title: action.payload,
        itemIds: []
      }

      state.lightboxes.push( newLightbox )
      console.log( 'addLightbox state:' )
      console.dir( state )
    },
    editLightbox: (state, action) => {
      const {id, title} = action.payload
      const lightbox = state.lightboxes.find( lightbox => lightbox.id === id )

      if( lightbox )
        lightbox.title = title
    },
    deleteLightbox: (state, action) => {
      const {lightboxId} = action.payload
      const lightbox = state.lightboxes.find( lightbox => lightbox.id === lightboxId )

      state.lightboxes = state.lightboxes.filter( lightbox => lightbox.id !== lightboxId )

      if( lightbox )
        state.items = state.items.filter( item => !lightbox.itemIds.includes( item.id ) )
    },
    updateLightboxes: (state, action) => {
      state.lightboxes = action.payload
    },
    updateLightboxItemIds: (state, action) => {
      const {id, itemsList} = action.payload

      state.lightboxes = state.lightboxes.map( lightbox => {
        if( lightbox.id === id ) {
          const itList = JSON.parse( itemsList )
          return {...lightbox, itemIds: itList.map( item => item.id )}
        }
        return lightbox
      })
    },
    addItem: (state, action) => {
      const {lightboxId, title} = action.payload
      const maxId = Math.max( 0, ...state.items.map( item => item.id ) )
      const newItem = {
        id: maxId + 1,
        title
      }

      const lightbox = state.lightboxes.find( lightbox => lightbox.id === lightboxId )
      if( lightbox )
        lightbox.itemIds.push( newItem.id )

      state.items.push( newItem )
      return state
    },
    editItem: (state, action) => {
      const {id, title, substrate} = action.payload
      const item = state.items.find( item => item.id === id)

      if( item ) {
        item.title = title
        item.badgeText = badgeText
      }
    },
    deleteItem: (state, action) => {
      const itemId = action.payload

      state.items = state.items.filter( item => item.id !== itemId )
      state.lightboxes = state.lightboxes.map( lightbox => {
        return {
          ...lightbox,
          itemIds: lightbox.itemIds.filter( id => id !== itemId )
        }
      })
    },
    setCurrentItem: (state, action) => {
      state.currentItemId = action.payload
    }
  }
})

export const {
  addLightbox,
  editLightbox,
  deleteLightbox,
  updateLightboxes,
  updateLightboxItemIds,
  addItem,
  editItem,
  deleteItem,
  setCurrentItem
} = calculatorSlice.actions

export default calculatorSlice.reducer
