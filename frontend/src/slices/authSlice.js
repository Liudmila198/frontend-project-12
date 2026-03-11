import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'
import { authStorage } from '../services/authStorage'
import { API } from '../constants/api'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(API.LOGIN, { username, password })
      const { token, username: returnedUsername } = response.data
      authStorage.setToken(token)
      authStorage.setUsername(returnedUsername)
      return { token, username: returnedUsername }
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка авторизации')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(API.SIGNUP, { username, password })
      const { token, username: returnedUsername } = response.data
      authStorage.setToken(token)
      authStorage.setUsername(returnedUsername)
      return { token, username: returnedUsername }
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        data: err.response?.data,
      })
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  authStorage.clear()
  dispatch(logout())
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: authStorage.getToken() || null,
    username: authStorage.getUsername() || null,
    loginError: null,
    registerError: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.username = null
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
        state.username = action.payload.username
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
        state.username = action.payload.username
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.registerError = action.payload
      })
  },
})

export const { logout, clearLoginError, clearRegisterError } = authSlice.actions
export default authSlice.reducer
