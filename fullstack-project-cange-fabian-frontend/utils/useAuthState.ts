import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  username?: string
  role?: string
  is_superuser?: boolean
}

export default function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRedacteur, setIsRedacteur] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) {
      setIsLoggedIn(false)
      setIsRedacteur(false)
      return
    }

    try {
      const decoded: DecodedToken = jwtDecode(token)
      const hasRedacteurRole = decoded.role === 'Redacteur' || decoded.is_superuser === true
      setIsLoggedIn(true)
      setIsRedacteur(hasRedacteurRole)
    } catch {
      setIsLoggedIn(false)
      setIsRedacteur(false)
    }
  }, [])

  return { isLoggedIn, isRedacteur }
}
