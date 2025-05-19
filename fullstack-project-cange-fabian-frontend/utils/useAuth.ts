import axios from 'axios'

const useAuth = () => {
  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return false

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh
      })
      localStorage.setItem('access', response.data.access)
      return true
    } catch (error) {
      console.error("Erreur lors du refresh token", error)
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      return false
    }
  }

  return { refreshToken }
}

export default useAuth
