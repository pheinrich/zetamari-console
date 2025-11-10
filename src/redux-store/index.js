// Third-party Imports
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import calculatorReducer from '@/redux-store/slices/calculator'

const rootReducer = combineReducers({
/*  chatReducer,
  calendarReducer,
  kanbanReducer,
  emailReducer,
*/  calculatorReducer  
})

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ['calculatorReducer'],
}
const persistedReducer = persistReducer( persistConfig, rootReducer )

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  })

export const persistor = persistStore( store )
