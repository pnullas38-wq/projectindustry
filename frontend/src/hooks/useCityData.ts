import { useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import { api } from '../api/client'
import { createDemoSnapshot } from '../data/demoSnapshot'
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

async function fetchFromApi(): Promise<CitySnapshot> {
  try {
    const { data } = await api.get<CitySnapshot>('/city/snapshot')
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && (err.response?.status === 401 || err.code === 'ERR_NETWORK' || !err.response)) {
      const { data } = await api.get<CitySnapshot>('/city/snapshot/public')
      return data
    }
    throw err
  }
}

/** City telemetry: REST first (Vercel-safe), optional WebSocket locally, demo fallback last. */
export function useCityData() {
  const { setSnapshot, setConnected, setConnectionError } = useCityStore()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const failCountRef = useRef(0)

  const applySnapshot = useCallback(
    (data: CitySnapshot, live: boolean) => {
      setSnapshot(data)
      setConnected(live)
      setConnectionError(live ? null : 'Demo mode — backend not reachable. Showing simulated data.')
      failCountRef.current = 0
    },
    [setSnapshot, setConnected, setConnectionError]
  )

  const fetchSnapshot = useCallback(async () => {
    try {
      const data = await fetchFromApi()
      applySnapshot(data, true)
      return data
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        applySnapshot(createDemoSnapshot(), false)
        return createDemoSnapshot()
      }
      failCountRef.current += 1
      if (failCountRef.current >= 2) {
        applySnapshot(createDemoSnapshot(), false)
        return createDemoSnapshot()
      }
      setConnected(false)
      setConnectionError('Connecting to NEXUS backend via REST API...')
      throw new Error('fetch failed')
    }
  }, [applySnapshot, setConnected, setConnectionError])

  const startPolling = useCallback(() => {
    if (pollRef.current) return
    fetchSnapshot().catch(() => {})
    pollRef.current = setInterval(() => {
      fetchSnapshot().catch(() => {})
    }, 2000)
  }, [fetchSnapshot])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  useEffect(() => {
    // Load immediately — never wait for WebSocket
    startPolling()

    // WebSocket only in local dev (not supported on Vercel serverless)
    let ws: WebSocket | null = null
    if (!import.meta.env.PROD) {
      try {
        ws = new WebSocket(resolveWsUrl())
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data)
            if (msg.type === 'city_update') {
              applySnapshot(msg.data as CitySnapshot, true)
            }
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* REST polling handles it */
      }
    }

    return () => {
      ws?.close()
      stopPolling()
    }
  }, [startPolling, stopPolling, applySnapshot])

  return { refresh: fetchSnapshot }
}
