import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import chatReducer from '../slices/chatSlice' // если есть

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    // другие редьюсеры
  },
})

export default store