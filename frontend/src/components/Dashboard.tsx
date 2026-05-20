import { useCityStore } from '../store/useCityStore'
import { useCityData } from '../hooks/useCityData'
import { useVoiceControl } from '../hooks/useVoiceControl'
import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
import KPIGrid from './panels/KPIGrid'
import TrafficPanel from './panels/TrafficPanel'
import EnvironmentPanel from './panels/EnvironmentPanel'
import AIInsightsPanel from './panels/AIInsightsPanel'
import EmergencyPanel from './panels/EmergencyPanel'
import NotificationsPanel from './panels/NotificationsPanel'
import CrowdPanel from './panels/CrowdPanel'
import DronePanel from './panels/DronePanel'
import CityMap from './map/CityMap'
import CityTwin3D from './three/CityTwin3D'
import AIChatbot from './ai/AIChatbot'

export default function Dashboard() {
  const { refresh } = useCityData()
  useVoiceControl()
  const { snapshot, activeModule, connected, connectionError } = useCityStore()

  if (!snapshot) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          {!connectionError && (
            <div className="w-16 h-16 border-2 border-nexus-primary border-t-nexus-cyan rounded-full animate-spin mx-auto mb-4" />
          )}
          <p className="hud-text text-nexus-glow animate-pulse">
            {connectionError ? 'CONNECTION FAILED' : 'INITIALIZING DIGITAL TWIN...'}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {connectionError ?? (connected ? 'Syncing city telemetry...' : 'Connecting to NEXUS backend...')}
          </p>
          {connectionError && (
            <button
              type="button"
              onClick={() => refresh()}
              className="mt-6 px-6 py-2 rounded bg-blue-600/80 hud-text text-sm hover:bg-blue-500"
            >
              RETRY CONNECTION
            </button>
          )}
          <p className="text-xs text-slate-600 mt-4">
            On Vercel, WebSocket may be limited — data loads via REST API automatically.
          </p>
        </div>
      </div>
    )
  }

  const { kpis, traffic, crowd, environment, emergencies, drones, ai_insights, notifications, digital_twin } = snapshot

  return (
    <div className="min-h-screen grid-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-3 pt-0 overflow-auto space-y-3">
          <KPIGrid kpis={kpis} />
          <NotificationsPanel notifications={notifications} />

          {activeModule === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
              <div className="xl:col-span-2 space-y-3">
                <CityMap trafficZones={traffic.zones} emergencies={emergencies} heatmap={traffic.heatmap} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TrafficPanel zones={traffic.zones} />
                  <EnvironmentPanel zones={environment.zones} forecast={environment.forecast} />
                </div>
              </div>
              <div className="space-y-3">
                <CityTwin3D zones={traffic.zones} />
                <AIInsightsPanel insights={ai_insights} />
                <EmergencyPanel emergencies={emergencies} />
              </div>
            </div>
          )}

          {activeModule === 'traffic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <TrafficPanel zones={traffic.zones} />
              <CityMap trafficZones={traffic.zones} emergencies={emergencies} heatmap={traffic.heatmap} />
            </div>
          )}

          {activeModule === 'crowd' && <CrowdPanel zones={crowd.zones as never} events={crowd.events as never} />}
          {activeModule === 'environment' && (
            <EnvironmentPanel zones={environment.zones} forecast={environment.forecast} />
          )}
          {activeModule === 'emergency' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <EmergencyPanel emergencies={emergencies} />
              <CityMap trafficZones={traffic.zones} emergencies={emergencies} heatmap={traffic.heatmap} />
            </div>
          )}
          {activeModule === 'drones' && <DronePanel drones={drones as never} />}
          {activeModule === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <AIInsightsPanel insights={ai_insights} />
              <AIChatbot />
            </div>
          )}
          {activeModule === 'twin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <CityTwin3D zones={traffic.zones} />
              <div className="glass-panel p-4">
                <h3 className="hud-text text-sm text-nexus-glow mb-4">DIGITAL TWIN STATUS</h3>
                <div className="space-y-3 text-sm">
                  <p>Sync: <span className="text-emerald-400">{digital_twin.sync_status.toUpperCase()}</span></p>
                  <p>Sensor Sync: {digital_twin.sensor_sync_pct}%</p>
                  <p>Buildings Active: {digital_twin.buildings_active.toLocaleString()}</p>
                  <p>Prediction Horizon: {digital_twin.prediction_horizon_min} min</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {Object.entries(digital_twin.layers).map(([k, v]) => (
                      <div key={k} className={`p-2 rounded text-xs ${v ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {k}: {v ? 'ACTIVE' : 'OFF'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
