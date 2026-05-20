import { create } from 'zustand'
import type { CitySnapshot } from '../types/city'

interface CityState {
  snapshot: CitySnapshot | null
  connected: boolean
  activeModule: string
  voiceEnabled: boolean
  setSnapshot: (s: CitySnapshot) => void
  setConnected: (c: boolean) => void
  setActiveModule: (m: string) => void
  setVoiceEnabled: (v: boolean) => void
}

export const useCityStore = create<CityState>((set) => ({
  snapshot: null,
  connected: false,
  activeModule: 'overview',
  voiceEnabled: false,
  setSnapshot: (snapshot) => set({ snapshot }),
  setConnected: (connected) => set({ connected }),
  setActiveModule: (activeModule) => set({ activeModule }),
  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
}))
