import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username,
        password,
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка авторизации')
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/signup', {
        username,
        password,
      })
      return response.data
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        data: err.response?.data,
      })
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    loginError: null,
    registerError: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      localStorage.removeItem('token')
    },
    clearLoginError: (state) => {
      state.loginError = null
    },
    clearRegisterError: (state) => {
      state.registerError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.loginError = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.loginError = action.payload || 'Неизвестная ошибка'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.registerError = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.registerError = action.payload
      })
  },
})

export const { logout, clearLoginError, clearRegisterError } = authSlice.actions
export default authSlice.reducer
