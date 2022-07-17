// store.js
import { configureStore } from '@reduxjs/toolkit'
import votersReducer from 'redux/reducers/votersReducer'
import proposalsReducer from 'redux/reducers/proposalsReducer'

export const store = configureStore({
  reducer: {
    voters: votersReducer,
    proposals: proposalsReducer
  }
})
