'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/utils/axios'
import { useAuth } from '@/providers/AuthProvider'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clears httpOnly cookies on the backend
        await API.post('logout/')
      } catch {
        // Even if the request fails, we still clear local state
      }
      logout()
      router.push('/')
    }
    performLogout()
  }, [router, logout])

  return <p className="text-white p-8">Logging out...</p>
}
