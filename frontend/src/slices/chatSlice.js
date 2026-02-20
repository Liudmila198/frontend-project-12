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
      console.log('renameChannel original name:', name)
      const cleanName = filterProfanity(name)
      console.log('renameChannel filtered name:', cleanName)
      const response = await api.patch(`/api/v1/channels/${id}`, {
        name: cleanName,
      })
      console.log('renameChannel response:', response.data)
      return response.data
    } catch (err) {
      console.error('renameChannel error:', err.response?.data)
      return rejectWithValue(err.response?.data)
    }
  },
)

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      console.log('removeChannel id:', id)
      await api.delete(`/api/v1/channels/${id}`)
      return id
    } catch (err) {
      console.error('removeChannel error:', err.response?.data)
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
      console.log('setCurrentChannel:', action.payload)
      state.currentChannelId = action.payload
    },
    addMessage(state, action) {
      const message = action.payload
      console.log(
        'addMessage called with message:',
        message,
        'current messages count:',
        state.messages.length,
      )
      if (!state.messages.some((m) => m.id === message.id)) {
        state.messages.push(message)
        console.log('Message added, new count:', state.messages.length)
      } else {
        console.log('Message already exists, skipping')
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
      console.log('removeChannelAction:', channelId)
      state.channels = state.channels.filter((c) => c.id !== channelId)
      if (state.currentChannelId === channelId) {
        state.currentChannelId = state.channels[0]?.id || null
        console.log('currentChannelId reset to:', state.currentChannelId)
      }
    },
    renameChannelAction(state, action) {
      const { id, name } = action.payload
      const channel = state.channels.find((c) => c.id === id)
      if (channel) {
        const oldName = channel.name
        channel.name = filterProfanity(name)
        console.log(
          `renameChannelAction: channel ${id} renamed from "${oldName}" to "${channel.name}"`,
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        console.log('fetchInitialData pending')
        state.loading = true
        state.error = null
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        console.log('fetchInitialData fulfilled')
        state.loading = false
        state.channels = action.payload.channels.map((c) => ({
          ...c,
          name: filterProfanity(c.name),
        }))
        state.messages = action.payload.messages
        console.log(
          'fetchInitialData.fulfilled, messages count:',
          state.messages.length,
        )
        if (!state.currentChannelId && action.payload.channels.length > 0) {
          state.currentChannelId = action.payload.channels[0].id
          console.log('Set currentChannelId to:', state.currentChannelId)
        }
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        console.log('fetchInitialData rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      .addCase(sendMessage.pending, (state) => {
        console.log('sendMessage pending')
        state.sending = true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false
        const message = action.payload
        console.log('sendMessage.fulfilled, message:', message)
        if (!state.messages.some((m) => m.id === message.id)) {
          state.messages.push(message)
          console.log(
            'Message added from sendMessage.fulfilled, new count:',
            state.messages.length,
          )
        } else {
          console.log(
            'Message already exists in sendMessage.fulfilled, skipping',
          )
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
        console.log('currentChannelId set to:', channel.id)
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = action.payload
        console.log('renameChannel.fulfilled, channel:', channel)
        const index = state.channels.findIndex((c) => c.id === channel.id)
        if (index !== -1) {
          const oldName = state.channels[index].name
          state.channels[index] = {
            ...channel,
            name: filterProfanity(channel.name),
          }
          console.log(
            `renameChannel.fulfilled: channel ${channel.id} renamed from "${oldName}" to "${state.channels[index].name}"`,
          )
        }
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        const channelId = action.payload
        console.log('removeChannel.fulfilled:', channelId)
        state.channels = state.channels.filter((c) => c.id !== channelId)
        if (state.currentChannelId === channelId) {
          state.currentChannelId = state.channels[0]?.id || null
          console.log('currentChannelId after removal:', state.currentChannelId)
        }
        state.messages = state.messages.filter((m) => m.channelId !== channelId)
        console.log('Removed messages for channel', channelId)
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
