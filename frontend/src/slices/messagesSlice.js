import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import socket from '../utils/socket'
import routes from '../routes' // ваши роуты (например, для API)

// Асинхронный thunk для отправки сообщения
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ text, channelId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.messagesPath(), {
        data: { text, channelId },
      })
      return response.data // ожидается { id, text, channelId, removable? }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    entities: [], // или объект { byId, allIds } – по желанию
    loading: 'idle',
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const message = action.payload
      // Проверяем, есть ли уже сообщение с таким id
      const exists = state.entities.some((m) => m.id === message.id)
      if (!exists) {
        state.entities.push(message)
      } else {
        console.log('Message already exists, skipping')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = 'idle'
        // Сообщение уже должно прийти через сокет, поэтому здесь не добавляем
        // Но если сокет не дублирует, можно добавить:
        // const message = action.payload;
        // if (!state.entities.some((m) => m.id === message.id)) {
        //   state.entities.push(message);
        // }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = 'idle'
        state.error = action.payload
      })
  },
})

export const { addMessage } = messagesSlice.actions
export default messagesSlice.reducer
