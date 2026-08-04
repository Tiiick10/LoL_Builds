'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import API from '@/utils/axios'

interface AuthContextValue {
  isLoggedIn: boolean
  isRedacteur: boolean
  role: string | null
  username: string | null
  isSuperuser: boolean
  loading: boolean
  /**
   * Called after a successful login. Tokens are stored in httpOnly cookies
   * by the backend; only the user metadata is stored client-side.
   */
  login: (data: { username?: string; role?: string; is_superuser?: boolean }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isSuperuser, setIsSuperuser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const syncFromStorage = () => {
      setRole(localStorage.getItem('role'))
      setUsername(localStorage.getItem('username'))
      setIsSuperuser(localStorage.getItem('is_superuser') === 'true')
    }

    const checkAuthStatus = async () => {
      syncFromStorage()
      try {
        const res = await API.get('auth/status/')
        const data = res.data
        if (!cancelled) {
          if (data.isLoggedIn) {
            setRole(data.role ?? localStorage.getItem('role'))
            setUsername(data.username ?? localStorage.getItem('username'))
            setIsSuperuser(Boolean(data.is_superuser))
          } else {
            // Cookie expired or absent - clean up stale metadata
            localStorage.removeItem('username')
            localStorage.removeItem('role')
            localStorage.removeItem('is_superuser')
            setRole(null)
            setUsername(null)
            setIsSuperuser(false)
          }
        }
      } catch {
        // Fall back to local metadata
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    checkAuthStatus()
    return () => {
      cancelled = true
    }
  }, [])

  const isLoggedIn = username !== null || role !== null || isSuperuser
  const isRedacteur = role === 'Redacteur' || isSuperuser === true

  const login: AuthContextValue['login'] = (data) => {
    if (data.username) {
      localStorage.setItem('username', data.username)
      setUsername(data.username)
    }
    if (data.role) {
      localStorage.setItem('role', data.role)
      setRole(data.role)
    }
    localStorage.setItem('is_superuser', String(data.is_superuser ?? false))
    setIsSuperuser(data.is_superuser ?? false)
  }

  const logout: AuthContextValue['logout'] = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('is_superuser')
    setRole(null)
    setUsername(null)
    setIsSuperuser(false)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ isLoggedIn, isRedacteur, role, username, isSuperuser, loading, login, logout }),
    [isLoggedIn, isRedacteur, role, username, isSuperuser, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
