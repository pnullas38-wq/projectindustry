export interface KPIs {
  city_health_score: number
  active_sensors: number
  avg_congestion_pct: number
  total_population_flow: number
  avg_aqi: number
  active_emergencies: number
  drones_active: number
  ai_predictions_24h: number
  energy_efficiency_pct: number
}

export interface ZoneTraffic {
  id: string
  name: string
  lat: number
  lng: number
  vehicle_count: number
  congestion_pct: number
  avg_speed_kmh: number
  incidents: number
}

export interface Emergency {
  id: string
  type: string
  severity: string
  zone_id: string
  lat: number
  lng: number
  timestamp: string
  description: string
  ai_recommendation: string
  confidence: number
}

export interface AIInsight {
  id: string
  agent: string
  type: string
  title: string
  detail: string
  confidence: number
  explainable_factors: string[]
}

export interface CitySnapshot {
  timestamp: string
  tick: number
  kpis: KPIs
  traffic: { zones: ZoneTraffic[]; signals: unknown[]; heatmap: { lat: number; lng: number; intensity: number }[] }
  crowd: { zones: unknown[]; events: unknown[] }
  environment: { zones: { id: string; name: string; aqi: number; pm25: number; noise_db: number; temp_c: number }[]; forecast: { hour: number; aqi: number }[] }
  emergencies: Emergency[]
  drones: unknown[]
  cameras: unknown[]
  infrastructure: unknown
  ai_insights: AIInsight[]
  digital_twin: { sync_status: string; sensor_sync_pct: number; layers: Record<string, boolean>; buildings_active: number; prediction_horizon_min: number }
  notifications: { id: string; level: string; message: string; timestamp: string }[]
}
