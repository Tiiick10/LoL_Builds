import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/'

const API = axios.create({
  baseURL,
  // Tokens are stored in httpOnly cookies by the backend.
  // This sends the cookies with every request.
  withCredentials: true,
})

// Interceptor to attach token to every request
// Tokens are now in httpOnly cookies, so no manual Authorization header is needed.

API.interceptors.request.use(config => {
  // No manual Authorization header needed - cookies handle auth.
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

    try {
      // The refresh endpoint reads the refresh token from the httpOnly cookie.
      // It sets a new access token cookie and returns the refreshed user metadata.
      const response = await axios.post(`${baseURL}token/refresh/`, {}, { withCredentials: true })
      const newAccessToken = response.data?.access

      if (!newAccessToken) {
        throw new Error('Missing access token in refresh response')
      }

      // Note: we do NOT store the token in localStorage (it's an httpOnly cookie).
      // The AuthProvider will re-sync user metadata from the refresh response.
      if (response.data?.username || response.data?.role) {
        if (response.data.username) localStorage.setItem('username', response.data.username)
        if (response.data.role) localStorage.setItem('role', response.data.role)
        localStorage.setItem('is_superuser', String(response.data.is_superuser ?? false))
      }

      return API(originalRequest)
    } catch (refreshError) {
      // Clean up local metadata on refresh failure
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('is_superuser')
      return Promise.reject(refreshError)
    }
  }
)

export default API
