import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios' // используем настроенный экземпляр
import routes from '../routes'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.loginPath(), {
        username,
        password,
      })
      return response.data // ожидается { token, username }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.signupPath(), {
        username,
        password,
      })
      return response.data // ожидается { token, username }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.username = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('username', action.payload.username)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('username', action.payload.username)
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
