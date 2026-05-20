import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface EnvZone {
  id: string
  name: string
  aqi: number
  pm25: number
  noise_db: number
  temp_c: number
}

export default function EnvironmentPanel({
  zones,
  forecast,
}: {
  zones: EnvZone[]
  forecast: { hour: number; aqi: number }[]
}) {
  return (
    <div className="glass-panel p-4 h-full">
      <h3 className="hud-text text-sm text-nexus-glow mb-4">ENVIRONMENT ANALYTICS — AQI & FORECAST</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={forecast}>
          <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #3b82f6' }} />
          <Line type="monotone" dataKey="aqi" stroke="#22d3ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
        {zones.map((z) => (
          <div key={z.id} className="flex justify-between text-xs border-b border-slate-800 pb-1">
            <span>{z.name}</span>
            <span className={z.aqi > 80 ? 'text-red-400' : z.aqi > 50 ? 'text-amber-400' : 'text-emerald-400'}>
              AQI {z.aqi} · {z.noise_db}dB · {z.temp_c}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
