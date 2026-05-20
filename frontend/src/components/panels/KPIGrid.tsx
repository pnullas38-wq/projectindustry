import { motion } from 'framer-motion'
import { Activity, Car, Users, Wind, AlertTriangle, Plane, Cpu, Zap } from 'lucide-react'
import type { KPIs } from '../../types/city'

const items = [
  { key: 'city_health_score', label: 'City Health', icon: Activity, suffix: '', color: 'text-emerald-400' },
  { key: 'avg_congestion_pct', label: 'Congestion', icon: Car, suffix: '%', color: 'text-amber-400' },
  { key: 'total_population_flow', label: 'Population Flow', icon: Users, suffix: '', color: 'text-nexus-cyan' },
  { key: 'avg_aqi', label: 'Avg AQI', icon: Wind, suffix: '', color: 'text-blue-400' },
  { key: 'active_emergencies', label: 'Emergencies', icon: AlertTriangle, suffix: '', color: 'text-red-400' },
  { key: 'drones_active', label: 'Drones Active', icon: Plane, suffix: '', color: 'text-purple-400' },
  { key: 'active_sensors', label: 'IoT Sensors', icon: Cpu, suffix: '', color: 'text-nexus-glow' },
  { key: 'energy_efficiency_pct', label: 'Energy Eff.', icon: Zap, suffix: '%', color: 'text-green-400' },
] as const

export default function KPIGrid({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ key, label, icon: Icon, suffix, color }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass-panel p-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-6 -mt-6" />
          <Icon className={`w-5 h-5 ${color} mb-2`} />
          <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
          <p className={`hud-text text-2xl ${color}`}>
            {typeof kpis[key] === 'number' ? (kpis[key] as number).toLocaleString() : '--'}
            {suffix}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
