import { createContext, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login as loginThunk, register as registerThunk, logoutThunk } from '../slices/authSlice'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const { token, username, loading, loginError, registerError } = useSelector(
    state => state.auth,
  )

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginThunk(credentials))
      if (loginThunk.fulfilled.match(result)) {
        return { success: true }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const register = useCallback(
    async (userData) => {
      const result = await dispatch(registerThunk(userData))
      if (registerThunk.fulfilled.match(result)) {
        return { success: true }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    dispatch(logoutThunk())
  }, [dispatch])

  const clearLoginError = useCallback(() => {
    // можно добавить action, если нужен
  }, [])

  const clearRegisterError = useCallback(() => {}, [])

  const value = {
    isAuthenticated: !!token,
    token,
    username,
    loading,
    loginError,
    registerError,
    login,
    register,
    logout,
    clearLoginError,
    clearRegisterError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
