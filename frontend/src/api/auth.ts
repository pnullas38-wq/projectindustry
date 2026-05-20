import { api } from './client'
import type { AuthTokens, LoginPayload, RegisterPayload, UserProfile } from '../types/auth'

export async function loginUser(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/login', payload)
  return data
}

export async function registerUser(payload: RegisterPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/register', payload)
  return data
}

export async function refreshSession(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken })
  return data
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refresh_token: refreshToken })
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/auth/me')
  return data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch('/auth/me/password', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}
