'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from './logo'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access'))
  }, [])

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>
          <ul className="flex flex-1 items-center justify-end gap-3">
            {!isLoggedIn ? (
              <>
                <li><Link href="/login" className="btn-sm text-gray-300">Login</Link></li>
                <li><Link href="/register" className="btn-sm text-white bg-indigo-600">Register</Link></li>
              </>
            ) : (
              <li><Link href="/logout" className="btn-sm text-white bg-red-500">Logout</Link></li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
