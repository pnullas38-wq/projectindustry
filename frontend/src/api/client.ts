import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

function resolveApiBase(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.PROD) return '/_/backend/api/v1'
  return 'http://localhost:8000/api/v1'
}

const API_BASE = resolveApiBase()

export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth/login', { username, password })
  return data
}

export async function chatAI(message: string) {
  const { data } = await api.post('/ai/chat', { message })
  return data
}

export async function generateReport() {
  const { data } = await api.post('/ai/reports/generate', { report_type: 'daily_operations' })
  return data
}
