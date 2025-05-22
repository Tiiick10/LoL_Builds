"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
  is_superuser: boolean;
  role: string;
  user_id: number;
}

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRedacteur, setIsRedacteur] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const router = useRouter();

 useEffect(() => {
  const token = localStorage.getItem("access");
  if (token) {
    setIsLoggedIn(true);

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.user_id;

      fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User data from API:", data);
          if (data.is_superuser) {
            setIsRedacteur(true);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });

    } catch (err) {
      console.error("Invalid token", err);
    }
  }
}, []);




  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setIsRedacteur(false);
    router.push("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* Navbar */}

      <div
        className="sticky top-0 z-30 h-25 px-8 flex justify-between items-center backdrop-blur-md"
        style={{ backgroundColor: "rgba(79, 57, 246, 0.1)" }}
      >
        <div className="absolute -top-4 left-8">
          <Link href="/">
            <Image src="/images/logo.svg" width={100} height={100} alt="Logo" />
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center justify-end gap-3 pl-28 w-full">
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  href="/create-build"
                  className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-sm text-white"
                >
                  Create Build
                </Link>
              </li>
              {isRedacteur && (
                <li>
                  <Link
                    href="/articles/create"
                    className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-sm text-white"
                  >
                    Create Article
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 py-1.5 px-4 rounded text-sm text-white"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-sm text-white"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded text-sm text-white"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile burger button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden z-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu */}

        {menuOpen && (
          <div className="absolute top-16 right-4 bg-black/90 rounded-lg p-4 flex flex-col gap-2 w-[170px] z-50 md:hidden">
            {isLoggedIn ? (
              <>
                <Link
                  href="/create-build"
                  onClick={() => setMenuOpen(false)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm text-center px-4 py-2 rounded transition"
                >
                  Create Build
                </Link>
                {isRedacteur && (
                  <Link
                    href="/articles/create"
                    onClick={() => setMenuOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm text-center px-4 py-2 rounded transition"
                  >
                    Create Article
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm text-center px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm text-center px-4 py-2 rounded transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm text-center px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

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
  );
}
