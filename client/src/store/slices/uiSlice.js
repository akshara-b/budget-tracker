import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  notifications: true,
  loadingStates: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications
    },
    setLoadingState: (state, action) => {
      state.loadingStates[action.payload.key] = action.payload.loading
    },
    clearLoadingState: (state, action) => {
      delete state.loadingStates[action.payload]
    },
  },
})

export const { 
  toggleSidebar, 
  setSidebarOpen, 
  toggleNotifications,
  setLoadingState,
  clearLoadingState
} = uiSlice.actions

export default uiSlice.reducer
