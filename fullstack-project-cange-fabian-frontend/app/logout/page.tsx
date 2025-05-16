'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    router.push('/')
  }, [router])

  return <p className="text-white p-8">Logging out...</p>
}
