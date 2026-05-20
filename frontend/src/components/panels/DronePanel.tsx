import { Plane, Battery, Navigation } from 'lucide-react'

interface Drone {
  id: string
  status: string
  battery: number
  altitude_m: number
  lat: number
  lng: number
  speed_kmh: number
  detected_objects: number
}

export default function DronePanel({ drones }: { drones: Drone[] }) {
  return (
    <div className="glass-panel p-4 h-full">
      <h3 className="hud-text text-sm text-nexus-glow mb-4 flex items-center gap-2">
        <Plane className="w-4 h-4" /> AUTONOMOUS DRONE FLEET
      </h3>
      <div className="space-y-3">
        {drones.map((d) => (
          <div key={d.id} className="bg-slate-900/60 p-3 rounded border border-blue-500/20">
            <div className="flex justify-between items-center">
              <span className="hud-text text-sm text-nexus-cyan">{d.id}</span>
              <span className={`text-xs uppercase ${d.status === 'standby' ? 'text-slate-500' : 'text-emerald-400'}`}>
                {d.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Battery className="w-3 h-3" /> {d.battery}%</span>
              <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {d.altitude_m}m</span>
              <span>Objects: {d.detected_objects}</span>
            </div>
            {d.status !== 'standby' && (
              <div className="mt-2 h-16 bg-slate-950 rounded flex items-center justify-center text-[10px] text-slate-600 border border-dashed border-slate-700">
                ▶ LIVE AERIAL FEED — AI Object Tracking Active
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
