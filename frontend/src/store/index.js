import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import chatReducer from '../slices/chatSlice'
import modalReducer from '../slices/modalSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    modal: modalReducer
  },
})

export default store  