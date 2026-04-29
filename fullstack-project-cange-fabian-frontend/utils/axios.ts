import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/'

const API = axios.create({
  baseURL,
})

// Interceptor to attach token to every request

API.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean })
    const isUnauthorized = error.response?.status === 401
    const isRefreshCall = originalRequest?.url?.includes('token/refresh/')

    if (!isUnauthorized || !originalRequest || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    const refresh = localStorage.getItem('refresh')

    if (!refresh) {
      localStorage.removeItem('access')
      return Promise.reject(error)
    }

    try {
      const response = await axios.post(`${baseURL}token/refresh/`, { refresh })
      const newAccessToken = response.data?.access

      if (!newAccessToken) {
        throw new Error('Missing access token in refresh response')
      }

      localStorage.setItem('access', newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return API(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      return Promise.reject(refreshError)
    }
  }
)

export default API
