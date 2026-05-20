import type { CitySnapshot } from '../types/city'

/** Offline fallback when backend is unreachable (e.g. frontend-only Vercel deploy). */
export function createDemoSnapshot(): CitySnapshot {
  const now = new Date().toISOString()
  return {
    timestamp: now,
    tick: 1,
    kpis: {
      city_health_score: 82,
      active_sensors: 1240,
      avg_congestion_pct: 48,
      total_population_flow: 3200,
      avg_aqi: 55,
      active_emergencies: 0,
      drones_active: 2,
      ai_predictions_24h: 156,
      energy_efficiency_pct: 78,
    },
    traffic: {
      zones: [
        { id: 'downtown', name: 'Downtown Core', lat: 40.7128, lng: -74.006, vehicle_count: 420, congestion_pct: 52, avg_speed_kmh: 35, incidents: 0 },
        { id: 'financial', name: 'Financial District', lat: 40.7074, lng: -74.0113, vehicle_count: 380, congestion_pct: 45, avg_speed_kmh: 40, incidents: 0 },
      ],
      signals: [],
      heatmap: [{ lat: 40.712, lng: -74.006, intensity: 0.6 }],
    },
    crowd: { zones: [], events: [] },
    environment: {
      zones: [{ id: 'downtown', name: 'Downtown Core', aqi: 55, pm25: 18, noise_db: 52, temp_c: 22 }],
      forecast: [{ hour: 0, aqi: 50 }, { hour: 1, aqi: 52 }],
    },
    emergencies: [],
    drones: [{ id: 'drone-alpha', status: 'patrol', battery: 85, altitude_m: 100, lat: 40.71, lng: -74.0, speed_kmh: 30, detected_objects: 5, mission: 'patrol' }],
    cameras: [],
    infrastructure: { signals: [], smart_lights: { active: 3400, energy_saved_kwh: 1200 }, parking: { occupancy_pct: 60, available_spots: 1800 }, grid_load_mw: 450 },
    ai_insights: [{
      id: 'demo-1',
      agent: 'NEXUS-Demo',
      type: 'info',
      title: 'Demo mode — connect backend for live data',
      detail: 'Showing simulated city data. Deploy backend service or run uvicorn locally.',
      confidence: 1,
      explainable_factors: ['offline_fallback'],
    }],
    digital_twin: { sync_status: 'demo', sensor_sync_pct: 100, layers: { traffic: true, environment: true, crowd: true, infrastructure: true, emergency: true }, buildings_active: 2847, prediction_horizon_min: 120 },
    notifications: [{ id: 'demo-n1', level: 'info', message: 'Demo mode active', timestamp: now }],
  }
}
