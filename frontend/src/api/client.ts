import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

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
