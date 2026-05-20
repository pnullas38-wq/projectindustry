import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { ZoneTraffic, Emergency } from '../../types/city'

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

export default function CityMap({
  trafficZones,
  emergencies,
  heatmap,
}: {
  trafficZones: ZoneTraffic[]
  emergencies: Emergency[]
  heatmap: { lat: number; lng: number; intensity: number }[]
}) {
  const center: [number, number] = [40.7128, -74.006]

  return (
    <div className="glass-panel p-2 h-full min-h-[320px] relative overflow-hidden rounded-lg">
      <h3 className="hud-text text-sm text-nexus-glow absolute top-4 left-4 z-[1000]">GEOSPATIAL INTELLIGENCE</h3>
      <MapContainer center={center} zoom={13} className="h-full min-h-[300px] w-full rounded" style={{ height: '100%', minHeight: 300 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={center} />
        {heatmap.slice(0, 25).map((p, i) => (
          <CircleMarker
            key={`h-${i}`}
            center={[p.lat, p.lng]}
            radius={4 + p.intensity * 8}
            pathOptions={{ color: '#3b82f6', fillColor: '#22d3ee', fillOpacity: 0.4 + p.intensity * 0.4 }}
          />
        ))}
        {trafficZones.map((z) => (
          <CircleMarker
            key={z.id}
            center={[z.lat, z.lng]}
            radius={8 + z.congestion_pct / 10}
            pathOptions={{
              color: z.congestion_pct > 70 ? '#ef4444' : z.congestion_pct > 45 ? '#f59e0b' : '#22d3ee',
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <strong>{z.name}</strong><br />
              Congestion: {z.congestion_pct}%<br />
              Vehicles: {z.vehicle_count}
            </Popup>
          </CircleMarker>
        ))}
        {emergencies.map((e) => (
          <CircleMarker
            key={e.id}
            center={[e.lat, e.lng]}
            radius={12}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }}
          >
            <Popup>
              <strong className="text-red-600">{e.type}</strong><br />
              {e.ai_recommendation}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
