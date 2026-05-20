import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { ZoneTraffic } from '../../types/city'

export default function TrafficPanel({ zones }: { zones: ZoneTraffic[] }) {
  const data = zones.map((z) => ({
    name: z.name.split(' ')[0],
    congestion: z.congestion_pct,
    speed: z.avg_speed_kmh,
  }))

  const color = (v: number) => (v > 70 ? '#ef4444' : v > 45 ? '#f59e0b' : '#22d3ee')

  return (
    <div className="glass-panel p-4 h-full">
      <h3 className="hud-text text-sm text-nexus-glow mb-4">TRAFFIC INTELLIGENCE — YOLOv8 + LSTM</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #3b82f6' }} />
          <Bar dataKey="congestion" radius={[4, 4, 0, 0]}>
            {data.map((e, i) => (
              <Cell key={i} fill={color(e.congestion)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {zones.slice(0, 4).map((z) => (
          <div key={z.id} className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="text-nexus-cyan">{z.name}</span>
            <p className="text-slate-400">{z.vehicle_count} vehicles · {z.avg_speed_kmh.toFixed(0)} km/h</p>
            {z.incidents > 0 && <span className="text-red-400">⚠ Incident detected</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
