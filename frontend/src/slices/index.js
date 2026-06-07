import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import projectsSlice from './projectsSlice.js'
import boardSlice from './boardSlice.js'

export default configureStore({
  reducer: {
    auth: authSlice,
    projects: projectsSlice,
    board: boardSlice,
  },
})
