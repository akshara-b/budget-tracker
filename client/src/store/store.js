import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import transactionReducer from './slices/transactionSlice.js'
import budgetReducer from './slices/budgetSlice.js'
import aiReducer from './slices/aiSlice.js'
import uiReducer from './slices/uiSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store
