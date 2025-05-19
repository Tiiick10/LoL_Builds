'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/custom-login/', {
        username,
        password
      })

      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      localStorage.setItem('is_admin', res.data.is_superuser)  // facultatif pour frontend

      router.push('/')
      setTimeout(() => {
        window.location.reload()
      }, 120)
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
