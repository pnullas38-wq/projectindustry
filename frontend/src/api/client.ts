import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore, getAccessToken } from '../store/useAuthStore'
import { refreshSession } from './auth'

function resolveApiBase(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.PROD) return '/_/backend/api/v1'
  return 'http://localhost:8000/api/v1'
}

export const api = axios.create({
  baseURL: resolveApiBase(),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, clearSession, setSession, updateAccessToken } = useAuthStore.getState()
  if (!refreshToken) {
    clearSession()
    return null
  }
  try {
    const tokens = await refreshSession(refreshToken)
    if (useAuthStore.getState().username) {
      updateAccessToken(tokens.access_token, tokens.expires_in)
      useAuthStore.setState({
        refreshToken: tokens.refresh_token,
        role: tokens.role,
        fullName: tokens.full_name,
      })
    } else {
      setSession(tokens)
    }
    return tokens.access_token
  } catch {
    clearSession()
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/register') ||
      original.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    original._retry = true
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    const newToken = await refreshPromise
    if (!newToken) return Promise.reject(error)

    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  }
)

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Start the backend (port 8000) or check your deployment URL.'
    }
    const data = error.response.data as {
      detail?: string | Array<{ msg?: string; loc?: (string | number)[] }>
    }
    if (typeof data?.detail === 'string') return data.detail
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((d) => {
          const field = d.loc?.filter((x) => x !== 'body').pop()
          const msg = d.msg?.replace(/^Value error,\s*/i, '') ?? 'Invalid value'
          return field ? `${field}: ${msg}` : msg
        })
        .join('; ')
    }
    if (error.response.status === 401) return 'Invalid username or password'
    if (error.response.status === 422) return 'Please check your input and try again.'
    if (error.response.status >= 500) return 'Server error. If deployed on Vercel, ensure the backend service is running.'
  }
  return 'Something went wrong. Please try again.'
}

export async function chatAI(message: string) {
  const { data } = await api.post('/ai/chat', { message })
  return data
}

export async function generateReport() {
  const { data } = await api.post('/ai/reports/generate', { report_type: 'daily_operations' })
  return data
}
