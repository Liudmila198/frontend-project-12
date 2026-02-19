import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'
import { filterProfanity } from '../utils/profanity'

export const fetchInitialData = createAsyncThunk(
  'chat/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const [channelsRes, messagesRes] = await Promise.all([
        api.get('/api/v1/channels'),
        api.get('/api/v1/messages'),
      ])
      return { channels: channelsRes.data, messages: messagesRes.data }
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        data: err.response?.data,
      })
    }
  },
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ text, channelId }, { rejectWithValue }) => {
    try {
      console.log('Sending message:', { text, channelId })
      const response = await api.post('/api/v1/messages', { text, channelId })
      console.log('Message sent, response:', response.data)
      return response.data
    } catch (err) {
      console.error('Send message error:', err.response?.data)
      return rejectWithValue(err.response?.data)
    }
  },
)

export const createChannel = createAsyncThunk(
  'chat/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      console.log('createChannel original name:', name)
      const cleanName = filterProfanity(name)
      console.log('createChannel filtered name:', cleanName)
      const response = await api.post('/api/v1/channels', { name: cleanName })
      console.log('createChannel response:', response.data)
      return response.data
    } catch (err) {
      console.error('createChannel error:', err.response?.data)
      return rejectWithValue(err.response?.data)
    }
  },
)

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const cleanName = filterProfanity(name)
      const response = await api.patch(`/api/v1/channels/${id}`, {
        name: cleanName,
      })
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
      await api.delete(`/api/v1/channels/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

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
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload
    },
    addMessage(state, action) {
      const message = action.payload
      if (!state.messages.some((m) => m.id === message.id)) {
        state.messages.push(message)
      }
    },
    addChannel(state, action) {
      const channel = action.payload
      console.log('addChannel received:', channel)
      if (!state.channels.some((c) => c.id === channel.id)) {
        const filteredChannel = {
          ...channel,
          name: filterProfanity(channel.name),
        }
        console.log('addChannel filtered:', filteredChannel)
        state.channels.push(filteredChannel)
      }
    },
    removeChannelAction(state, action) {
      const channelId = action.payload
      state.channels = state.channels.filter((c) => c.id !== channelId)
      if (state.currentChannelId === channelId) {
        state.currentChannelId = state.channels[0]?.id || null
      }
    },
    renameChannelAction(state, action) {
      const { id, name } = action.payload
      const channel = state.channels.find((c) => c.id === id)
      if (channel) {
        channel.name = filterProfanity(name)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload.channels.map((c) => ({
          ...c,
          name: filterProfanity(c.name),
        }))
        state.messages = action.payload.messages
        if (!state.currentChannelId && action.payload.channels.length > 0) {
          state.currentChannelId = action.payload.channels[0].id
        }
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false
        const message = action.payload
        if (!state.messages.some((m) => m.id === message.id)) {
          state.messages.push(message)
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false
        console.error('sendMessage rejected:', action.payload)
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        const channel = action.payload
        console.log('createChannel.fulfilled, raw channel:', channel)
        const filteredChannel = {
          ...channel,
          name: filterProfanity(channel.name),
        }
        console.log('createChannel.fulfilled filtered:', filteredChannel)
        state.channels.push(filteredChannel)
        state.currentChannelId = channel.id
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = action.payload
        const index = state.channels.findIndex((c) => c.id === channel.id)
        if (index !== -1) {
          state.channels[index] = {
            ...channel,
            name: filterProfanity(channel.name),
          }
        }
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        const channelId = action.payload
        state.channels = state.channels.filter((c) => c.id !== channelId)
        if (state.currentChannelId === channelId) {
          state.currentChannelId = state.channels[0]?.id || null
        }
        state.messages = state.messages.filter((m) => m.channelId !== channelId)
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
