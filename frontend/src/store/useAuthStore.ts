import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthTokens, UserProfile } from '../types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  username: string | null
  email: string | null
  role: string | null
  fullName: string | null
  userId: string | null
  isAuthenticated: boolean
  setSession: (tokens: AuthTokens, profile?: UserProfile) => void
  clearSession: () => void
  updateAccessToken: (accessToken: string, expiresIn: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      username: null,
      email: null,
      role: null,
      fullName: null,
      userId: null,
      isAuthenticated: false,
      setSession: (tokens, profile) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: Date.now() + tokens.expires_in * 1000,
          username: tokens.username,
          email: tokens.email,
          role: tokens.role,
          fullName: tokens.full_name,
          userId: profile?.id ?? null,
          isAuthenticated: true,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          username: null,
          email: null,
          role: null,
          fullName: null,
          userId: null,
          isAuthenticated: false,
        }),
      updateAccessToken: (accessToken, expiresIn) =>
        set({
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
        }),
    }),
    { name: 'nexus-auth-v2' }
  )
)

// Backward-compatible getter for legacy token field
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken
}
