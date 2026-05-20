import { Users } from 'lucide-react'

interface CrowdZone {
  id: string
  name: string
  people_count: number
  density_level: string
  suspicious_score: number
}

export default function CrowdPanel({ zones, events }: { zones: CrowdZone[]; events: { name: string; attendance: number; risk: string }[] }) {
  return (
    <div className="glass-panel p-4 h-full">
      <h3 className="hud-text text-sm text-nexus-glow mb-4 flex items-center gap-2">
        <Users className="w-4 h-4" /> CROWD ANALYTICS — CV + DENSITY AI
      </h3>
      <div className="space-y-2 mb-4">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span>{z.name}</span>
                <span className="text-nexus-cyan">{z.people_count} people</span>
              </div>
              <div className="h-2 bg-slate-800 rounded mt-1 overflow-hidden">
                <div
                  className={`h-full rounded ${
                    z.density_level === 'high' ? 'bg-red-500' : z.density_level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, z.people_count / 10)}%` }}
                />
              </div>
            </div>
            {z.suspicious_score > 0.2 && (
              <span className="text-[10px] text-red-400">SUS {Math.round(z.suspicious_score * 100)}%</span>
            )}
          </div>
        ))}
      </div>
      <h4 className="text-xs text-slate-500 mb-2">ACTIVE EVENTS</h4>
      {events.map((e) => (
        <div key={e.name} className="text-xs flex justify-between py-1 border-b border-slate-800">
          <span>{e.name}</span>
          <span>{e.attendance.toLocaleString()} · {e.risk} risk</span>
        </div>
      ))}
    </div>
  )
}
