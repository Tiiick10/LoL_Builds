import { useAuth } from '@/providers/AuthProvider'

/**
 * Backwards-compatible hook.
 * Reads reactive auth state from the AuthContext instead of localStorage.
 */
export default function useAuthState() {
  const { isLoggedIn, isRedacteur } = useAuth()
  return { isLoggedIn, isRedacteur }
}
