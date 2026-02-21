import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes'

// ---------- Асинхронные действия ----------
export const fetchInitialData = createAsyncThunk(
  'chat/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const [channelsResponse, messagesResponse] = await Promise.all([
        axios.get(routes.channelsPath()),
        axios.get(routes.messagesPath()),
      ])
      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const createChannel = createAsyncThunk(
  'chat/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.channelsPath(), { name })
      return response.data // ожидается объект канала { id, name }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(routes.channelPath(id), { name })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(routes.channelPath(id))
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ text, channelId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.channelMessagesPath(channelId), {
        text,
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

// ---------- Слайс ----------
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    loading: false,
    error: null,
    sending: false,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
    addMessage: (state, action) => {
      const message = action.payload
      const exists = state.messages.some((m) => m.id === message.id)
      if (!exists) {
        state.messages.push(message)
      }
    },
    addChannel: (state, action) => {
      const channel = action.payload
      const exists = state.channels.some((c) => c.id === channel.id)
      if (!exists) {
        state.channels.push(channel)
      }
    },
    removeChannelAction: (state, action) => {
      const channelId = action.payload
      state.channels = state.channels.filter((c) => c.id !== channelId)
      // переключаемся на общий канал, если удалён текущий
      if (state.currentChannelId === channelId) {
        const general = state.channels.find((c) => c.id === 1)
        state.currentChannelId = general ? general.id : null
      }
      state.messages = state.messages.filter((m) => m.channelId !== channelId)
    },
    renameChannelAction: (state, action) => {
      const updatedChannel = action.payload
      const index = state.channels.findIndex((c) => c.id === updatedChannel.id)
      if (index !== -1) {
        state.channels[index] = { ...state.channels[index], ...updatedChannel }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInitialData
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload.channels
        state.messages = action.payload.messages
        if (
          state.currentChannelId === null &&
          action.payload.channels.length > 0
        ) {
          state.currentChannelId = action.payload.channels[0].id
        }
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // createChannel – добавляем канал в любом случае (даже если сокет не сработает)
      .addCase(createChannel.pending, (state) => {
        state.sending = true
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.sending = false
        const channel = action.payload
        const exists = state.channels.some((c) => c.id === channel.id)
        if (!exists) {
          state.channels.push(channel)
        }
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })

      // renameChannel
      .addCase(renameChannel.pending, (state) => {
        state.sending = true
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.sending = false
        const updated = action.payload
        const index = state.channels.findIndex((c) => c.id === updated.id)
        if (index !== -1) {
          state.channels[index] = updated
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })

      // removeChannel
      .addCase(removeChannel.pending, (state) => {
        state.sending = true
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.sending = false
        const channelId = action.payload
        state.channels = state.channels.filter((c) => c.id !== channelId)
        if (state.currentChannelId === channelId) {
          const general = state.channels.find((c) => c.id === 1)
          state.currentChannelId = general ? general.id : null
        }
        state.messages = state.messages.filter((m) => m.channelId !== channelId)
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sending = true
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sending = false
        // сообщение уже должно прийти через сокет, не добавляем повторно
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })
  },
})

export const {
  setCurrentChannel,
  addMessage,
  addChannel,
  removeChannelAction,
  renameChannelAction,
} = chatSlice.actions

export default chatSlice.reducer
