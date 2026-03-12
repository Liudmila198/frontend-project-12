import axios from 'axios'
import { authStorage } from '../services/authStorage'

const instance = axios.create({
  baseURL: '',
})

instance.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
