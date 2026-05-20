import { create } from 'zustand'
import type { CitySnapshot } from '../types/city'

interface CityState {
  snapshot: CitySnapshot | null
  connected: boolean
  connectionError: string | null
  activeModule: string
  voiceEnabled: boolean
  setSnapshot: (s: CitySnapshot) => void
  setConnected: (c: boolean) => void
  setConnectionError: (e: string | null) => void
  setActiveModule: (m: string) => void
  setVoiceEnabled: (v: boolean) => void
}

export const useCityStore = create<CityState>((set) => ({
  snapshot: null,
  connected: false,
  connectionError: null,
  activeModule: 'overview',
  voiceEnabled: false,
  setSnapshot: (snapshot) => set({ snapshot, connectionError: null }),
  setConnected: (connected) => set({ connected }),
  setConnectionError: (connectionError) => set({ connectionError }),
  setActiveModule: (activeModule) => set({ activeModule }),
  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
}))
