import { motion } from 'framer-motion'
import { Bell, Activity } from 'lucide-react'
import { useCityStore } from '../../store/useCityStore'

export default function Header() {
  const snapshot = useCityStore((s) => s.snapshot)

  return (
    <header className="glass-panel mx-3 mt-0 mb-3 px-6 py-3 flex items-center justify-between">
      <div>
        <motion.h1
          className="hud-text text-xl text-transparent bg-clip-text bg-gradient-to-r from-nexus-glow to-nexus-cyan"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          NEXUS DIGITAL TWIN — SMART CITY COMMAND CENTER
        </motion.h1>
        <p className="text-xs text-slate-500">
          {snapshot?.timestamp ? `Last sync: ${new Date(snapshot.timestamp).toLocaleTimeString()}` : 'Awaiting data...'}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="hud-text text-2xl text-emerald-400">
            {snapshot?.kpis.city_health_score?.toFixed(0) ?? '--'}
          </span>
          <span className="text-xs text-slate-500">CITY HEALTH</span>
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-nexus-glow" />
          {(snapshot?.notifications?.length ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
              {snapshot!.notifications.length}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
