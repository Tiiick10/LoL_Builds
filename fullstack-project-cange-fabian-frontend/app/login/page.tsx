'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/utils/axios'
import { useAuth } from '@/providers/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await API.post('custom-login/', {
        username,
        password
      })

      // Tokens are stored in httpOnly cookies by the backend.
      // Only user metadata is returned in the JSON body.
      login({
        username: res.data.username,
        role: res.data.role,
        is_superuser: res.data.is_superuser,
      })

      // No forced reload needed - the AuthContext is reactive.
      router.push('/')
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700"
          required
        />
        <button type="submit" className="w-full bg-indigo-600 py-2 rounded">
          Login
        </button>
      </form>
    </main>
  )
}
