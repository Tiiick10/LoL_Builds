"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Header from "@/components/ui/header"

export default function HeroSection() {
  const [showTopButton, setShowTopButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="relative w-screen text-white overflow-hidden min-h-[100vh]">

      {/* Video background */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/league-banner.webm"
      />

      {/* Dark overlay */}

      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Header overlay (reuses the shared Header component) */}

      <Header overlay />

      {/* Hero Content */}

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[60vh] px-4 pb-20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          League of Builds
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Discover, vote and share your favorite champions builds
        </p>
        <div className="flex gap-4">
          <Link
            href="/builds"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full transition"
          >
            See builds
          </Link>
          <Link
            href="/articles"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition"
          >
            See articles
          </Link>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          showTopButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </section>
  )
}

