import { useEffect, useState, type ReactNode } from 'react'
import { fetchCurrentUser } from '../../api/auth'
import { useAuthStore } from '../../store/useAuthStore'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken, setSession, clearSession } = useAuthStore()
  const [checking, setChecking] = useState(!!accessToken)

  useEffect(() => {
    if (!accessToken) {
      setChecking(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const profile = await fetchCurrentUser()
        if (!cancelled) {
          useAuthStore.setState({
            userId: profile.id,
            username: profile.username,
            email: profile.email,
            role: profile.role,
            fullName: profile.full_name,
            isAuthenticated: true,
          })
        }
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()

    return () => { cancelled = true }
  }, [accessToken, clearSession])

  if (checking) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-nexus-primary border-t-nexus-cyan rounded-full animate-spin mx-auto mb-4" />
          <p className="hud-text text-nexus-glow text-sm">VERIFYING SESSION...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !accessToken) return null

  return <>{children}</>
}
