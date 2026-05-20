import { motion } from 'framer-motion'
import {
  LayoutDashboard, Car, Users, Cloud, AlertTriangle,
  Plane, Brain, Box, LogOut, Mic,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useCityStore } from '../../store/useCityStore'

const modules = [
  { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
  { id: 'traffic', label: 'Traffic AI', icon: Car },
  { id: 'crowd', label: 'Crowd Analytics', icon: Users },
  { id: 'environment', label: 'Environment', icon: Cloud },
  { id: 'emergency', label: 'Emergency AI', icon: AlertTriangle },
  { id: 'drones', label: 'Drone Fleet', icon: Plane },
  { id: 'ai', label: 'AI Engine', icon: Brain },
  { id: 'twin', label: 'Digital Twin', icon: Box },
]

export default function Sidebar() {
  const { activeModule, setActiveModule, voiceEnabled, setVoiceEnabled, connected } = useCityStore()
  const { role, fullName, logout } = useAuthStore()

  return (
    <aside className="w-56 glass-panel m-3 p-4 flex flex-col shrink-0">
      <div className="mb-6">
        <h2 className="hud-text text-lg text-nexus-glow">NEXUS</h2>
        <p className="text-xs text-slate-500 truncate">{fullName}</p>
        <span className="text-[10px] uppercase text-nexus-cyan">{role}</span>
      </div>
      <div className={`text-xs mb-4 flex items-center gap-2 ${connected ? 'text-emerald-400' : 'text-amber-400'}`}>
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        {connected ? 'LIVE SYNC' : 'CONNECTING...'}
      </div>
      <nav className="flex-1 space-y-1">
        {modules.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveModule(id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-all ${
              activeModule === id
                ? 'bg-blue-500/20 text-nexus-cyan border border-blue-500/40 shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className={`flex items-center gap-2 px-3 py-2 rounded text-sm mb-2 ${
          voiceEnabled ? 'text-nexus-cyan bg-cyan-500/10' : 'text-slate-400'
        }`}
      >
        <Mic className="w-4 h-4" />
        Voice {voiceEnabled ? 'ON' : 'OFF'}
      </button>
      <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-400 text-sm">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  )
}
