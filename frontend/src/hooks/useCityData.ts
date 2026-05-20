import { useCallback, useEffect, useRef } from 'react'
import { api } from '../api/client'
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

/** Live city data: WebSocket when available, REST polling as fallback (required on Vercel). */
export function useCityData() {
  const { setSnapshot, setConnected, setConnectionError } = useCityStore()
  const modeRef = useRef<'ws' | 'poll' | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchSnapshot = useCallback(async () => {
    const { data } = await api.get<CitySnapshot>('/city/snapshot')
    setSnapshot(data)
    setConnected(true)
    return data
  }, [setSnapshot, setConnected])

  const startPolling = useCallback(() => {
    if (modeRef.current === 'poll') return
    modeRef.current = 'poll'
    fetchSnapshot().catch(() => {
      setConnected(false)
      setConnectionError('Backend unreachable. Start the API server or check your deployment.')
    })
    pollRef.current = setInterval(() => {
      fetchSnapshot().catch(() => setConnected(false))
    }, 2000)
  }, [fetchSnapshot, setConnected, setConnectionError])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  useEffect(() => {
    let ws: WebSocket | null = null
    let wsReceived = false
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null

    const connectWs = () => {
      if (modeRef.current === 'poll') return

      try {
        ws = new WebSocket(resolveWsUrl())
      } catch {
        startPolling()
        return
      }

      ws.onopen = () => {
        setConnected(true)
        fallbackTimer = setTimeout(() => {
          if (!wsReceived) startPolling()
        }, 4000)
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'city_update') {
            wsReceived = true
            modeRef.current = 'ws'
            stopPolling()
            setSnapshot(msg.data as CitySnapshot)
            setConnected(true)
          }
        } catch {
          /* ignore */
        }
      }

      ws.onerror = () => {
        setConnected(false)
        if (!wsReceived) startPolling()
      }

      ws.onclose = () => {
        setConnected(false)
        if (modeRef.current === 'ws') {
          modeRef.current = null
          startPolling()
        } else if (!wsReceived) {
          startPolling()
        } else {
          setTimeout(connectWs, 5000)
        }
      }
    }

    // Immediate REST fetch so UI never hangs on "Initializing"
    fetchSnapshot()
      .then(() => {
        connectWs()
      })
      .catch(() => {
        setConnected(false)
        setConnectionError('Cannot load city data. Ensure the backend is running at /api/v1.')
        connectWs()
        startPolling()
      })

    return () => {
      ws?.close()
      if (fallbackTimer) clearTimeout(fallbackTimer)
      stopPolling()
      modeRef.current = null
    }
  }, [fetchSnapshot, setSnapshot, setConnected, startPolling, stopPolling])

  return { refresh: fetchSnapshot }
}
