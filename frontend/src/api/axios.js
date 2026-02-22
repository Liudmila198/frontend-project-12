import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const instance = axios.create({
  baseURL,
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default instance
