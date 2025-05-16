'use client'

import Link from 'next/link'
import Logo from './logo'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Logo / Home */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Auth */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="btn-sm bg-red-600 hover:bg-red-700 py-[5px] px-4 text-white rounded"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="btn-sm bg-gray-800 py-[5px] px-4 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="btn-sm bg-indigo-600 py-[5px] px-4 text-white rounded hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
