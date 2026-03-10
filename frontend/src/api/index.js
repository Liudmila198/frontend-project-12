import axios from 'axios'
import store from '../store' // теперь файл существует

const instance = axios.create({
  baseURL: '',
})

instance.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance