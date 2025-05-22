'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  username: string
  is_superuser: boolean
  role: string
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRedacteur, setIsRedacteur] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access')
    const role = localStorage.getItem("role")
    if (token) {
      setIsLoggedIn(!!token)
      try {
        const decoded: DecodedToken = jwtDecode(token)
        if (role === "Redacteur") {
          setIsRedacteur(true)
        }
      } catch (err) {
        console.error('Invalid token')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsLoggedIn(false)
    setIsRedacteur(false)
    router.push('/')
  }

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">

          {/* Logo / Home */}

          <div className="flex mt-7">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/logo.svg"
                width={100}
                height={100}
                alt="Logo"
                className="object-contain"
              />
            </Link>
          </div>

          {/* Mobile Burger */}

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden z-40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}

          <ul className="hidden md:flex flex-1 items-center justify-end gap-3">
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/create-build" className="btn-sm bg-green-600 hover:bg-green-700 py-[5px] px-4 text-white rounded">Create Build</Link>
                </li>
                {isRedacteur && (
                  <li>
                    <Link href="/articles/create" className="btn-sm bg-blue-600 hover:bg-blue-700 py-[5px] px-4 text-white rounded">Create Article</Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="btn-sm bg-red-600 hover:bg-red-700 py-[5px] px-4 text-white rounded">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="btn-sm bg-gray-800 py-[5px] px-4 text-gray-300 rounded hover:bg-gray-700">Login</Link>
                </li>
                <li>
                  <Link href="/register" className="btn-sm bg-indigo-600 py-[5px] px-4 text-white rounded hover:bg-indigo-700">Register</Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu */}

          {menuOpen && (
            <div className="absolute top-16 right-4 bg-black/90 rounded-lg p-4 flex flex-col gap-2 w-[170px] z-50 md:hidden">
              {isLoggedIn ? (
                <>
                  <Link href="/create-build" onClick={() => setMenuOpen(false)} className="bg-green-600 hover:bg-green-700 text-white text-sm text-center px-4 py-2 rounded transition">Create Build</Link>
                  {isRedacteur && (
                    <Link href="/articles/create" onClick={() => setMenuOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm text-center px-4 py-2 rounded transition">Create Article</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="bg-red-600 hover:bg-red-700 text-white text-sm text-center px-4 py-2 rounded transition">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white text-sm text-center px-4 py-2 rounded transition">Login</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm text-center px-4 py-2 rounded transition">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
