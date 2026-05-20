import { useEffect, useRef } from 'react'
import { useCityStore } from '../store/useCityStore'
import type { CitySnapshot } from '../types/city'

function resolveWsUrl(): string {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  if (import.meta.env.PROD) {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${proto}//${window.location.host}/_/backend/api/v1/ws/live`
  }
  return 'ws://localhost:8000/api/v1/ws/live'
}

export function useWebSocket(enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null)
  const { setSnapshot, setConnected } = useCityStore()

  useEffect(() => {
    if (!enabled) return

    const connect = () => {
      const ws = new WebSocket(resolveWsUrl())
      wsRef.current = ws

      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false)
        setTimeout(connect, 3000)
      }
      ws.onerror = () => setConnected(false)
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'city_update') {
            setSnapshot(msg.data as CitySnapshot)
          }
        } catch {
          /* ignore parse errors */
        }
      }
    }

    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [enabled, setSnapshot, setConnected])
}
