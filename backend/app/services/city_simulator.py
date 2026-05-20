"""Real-time smart city data simulator for digital twin synchronization."""
import asyncio
import math
import random
import uuid
from datetime import datetime, timezone
from typing import Any

from app.core.config import get_settings

settings = get_settings()

ZONES = [
    {"id": "downtown", "name": "Downtown Core", "lat": 40.7128, "lng": -74.0060},
    {"id": "financial", "name": "Financial District", "lat": 40.7074, "lng": -74.0113},
    {"id": "harbor", "name": "Harbor Zone", "lat": 40.7022, "lng": -74.0158},
    {"id": "tech", "name": "Innovation Hub", "lat": 40.7282, "lng": -73.9942},
    {"id": "residential", "name": "Residential North", "lat": 40.7614, "lng": -73.9776},
    {"id": "industrial", "name": "Industrial East", "lat": 40.7420, "lng": -73.9650},
]

CAMERAS = [
    {"id": "cam-01", "zone": "downtown", "type": "traffic", "status": "online"},
    {"id": "cam-02", "zone": "financial", "type": "crowd", "status": "online"},
    {"id": "cam-03", "zone": "harbor", "type": "environment", "status": "online"},
    {"id": "cam-04", "zone": "tech", "type": "security", "status": "online"},
]

DRONES = [
    {"id": "drone-alpha", "status": "patrol", "battery": 87, "altitude_m": 120},
    {"id": "drone-beta", "status": "surveillance", "battery": 72, "altitude_m": 95},
    {"id": "drone-gamma", "status": "standby", "battery": 100, "altitude_m": 0},
]

SIGNALS = [
    {"id": "sig-01", "intersection": "5th & Broadway", "phase": "green", "wait_sec": 12},
    {"id": "sig-02", "intersection": "Wall & Water", "phase": "yellow", "wait_sec": 4},
    {"id": "sig-03", "intersection": "Tech Ave & Main", "phase": "red", "wait_sec": 28},
]


class CitySimulator:
    """Generates realistic streaming telemetry for the digital twin."""

    def __init__(self):
        self._tick = 0
        self._alerts: list[dict] = []
        self._insights: list[dict] = []

    def _time(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def generate_snapshot(self) -> dict[str, Any]:
        self._tick += 1
        t = self._tick
        hour_factor = (datetime.now().hour % 24) / 24

        traffic_zones = []
        for z in ZONES:
            base = 30 + hash(z["id"]) % 40
            density = int(base + 25 * math.sin(t / 8 + hour_factor * 6) + random.randint(-5, 8))
            density = max(5, min(98, density))
            traffic_zones.append({
                **z,
                "vehicle_count": int(density * 12 + random.randint(0, 50)),
                "congestion_pct": density,
                "avg_speed_kmh": max(8, 65 - density * 0.55),
                "incidents": 1 if density > 85 and random.random() > 0.92 else 0,
            })

        crowd_zones = []
        for z in ZONES[:4]:
            count = int(200 + 800 * abs(math.sin(t / 6)) + random.randint(-50, 100))
            crowd_zones.append({
                **z,
                "people_count": count,
                "density_level": "high" if count > 700 else "medium" if count > 350 else "low",
                "suspicious_score": round(random.uniform(0, 0.35) if count > 600 else random.uniform(0, 0.1), 2),
            })

        pollution = []
        for z in ZONES:
            aqi = int(35 + 45 * math.sin(t / 10 + hour_factor * 4) + random.randint(-8, 12))
            pollution.append({
                **z,
                "aqi": max(20, min(180, aqi)),
                "pm25": round(aqi * 0.35 + random.uniform(2, 8), 1),
                "noise_db": round(45 + aqi * 0.15 + random.uniform(-3, 5), 1),
                "temp_c": round(18 + 8 * math.sin(hour_factor * math.pi) + random.uniform(-1, 1), 1),
            })

        emergencies = self._generate_emergencies(traffic_zones, t)
        kpis = self._compute_kpis(traffic_zones, crowd_zones, pollution, emergencies)
        ai_insights = self._generate_ai_insights(traffic_zones, pollution, emergencies, t)
        drones = self._update_drones(t)
        infrastructure = self._infrastructure_state(t)

        return {
            "timestamp": self._time(),
            "tick": t,
            "kpis": kpis,
            "traffic": {"zones": traffic_zones, "signals": infrastructure["signals"], "heatmap": self._traffic_heatmap()},
            "crowd": {"zones": crowd_zones, "events": self._crowd_events()},
            "environment": {"zones": pollution, "forecast": self._env_forecast()},
            "emergencies": emergencies,
            "drones": drones,
            "cameras": CAMERAS,
            "infrastructure": infrastructure,
            "ai_insights": ai_insights,
            "digital_twin": self._digital_twin_state(traffic_zones, pollution),
            "notifications": self._notifications(emergencies),
        }

    def _compute_kpis(self, traffic, crowd, pollution, emergencies) -> dict:
        avg_congestion = sum(z["congestion_pct"] for z in traffic) / len(traffic)
        total_people = sum(z["people_count"] for z in crowd)
        avg_aqi = sum(z["aqi"] for z in pollution) / len(pollution)
        return {
            "city_health_score": round(100 - avg_congestion * 0.3 - (avg_aqi - 50) * 0.2 - len(emergencies) * 5, 1),
            "active_sensors": 1247 + random.randint(-10, 15),
            "avg_congestion_pct": round(avg_congestion, 1),
            "total_population_flow": total_people,
            "avg_aqi": round(avg_aqi, 0),
            "active_emergencies": len(emergencies),
            "drones_active": sum(1 for d in DRONES if d["status"] != "standby"),
            "ai_predictions_24h": 156 + self._tick % 20,
            "energy_efficiency_pct": round(78 + random.uniform(-2, 3), 1),
        }

    def _generate_emergencies(self, traffic, t) -> list[dict]:
        events = []
        if t % 17 == 0 or (random.random() > 0.97 and t > 3):
            zone = random.choice(traffic)
            etype = random.choice(["accident", "fire", "medical", "flood_risk"])
            events.append({
                "id": str(uuid.uuid4())[:8],
                "type": etype,
                "severity": random.choice(["medium", "high", "critical"]),
                "zone_id": zone["id"],
                "lat": zone["lat"] + random.uniform(-0.002, 0.002),
                "lng": zone["lng"] + random.uniform(-0.002, 0.002),
                "timestamp": self._time(),
                "description": f"{etype.replace('_', ' ').title()} detected via AI vision + sensor fusion",
                "ai_recommendation": self._emergency_recommendation(etype),
                "confidence": round(random.uniform(0.82, 0.98), 2),
            })
        return events

    def _emergency_recommendation(self, etype: str) -> str:
        recs = {
            "accident": "Dispatch EMS unit A-7, reroute traffic via Highway 9, activate variable message signs.",
            "fire": "Deploy fire response team B-2, evacuate 200m radius, shut down HVAC in adjacent blocks.",
            "medical": "Route ambulance via optimized path (ETA 4.2 min), clear intersection sig-02.",
            "flood_risk": "Activate pump stations P-12/P-15, issue public alert level 2 for Harbor Zone.",
        }
        return recs.get(etype, "Monitor situation and escalate to command center.")

    def _generate_ai_insights(self, traffic, pollution, emergencies, t) -> list[dict]:
        insights = [
            {
                "id": f"ins-{t}-1",
                "agent": "TrafficOptimizer",
                "type": "prediction",
                "title": "Congestion spike predicted in Financial District",
                "detail": "LSTM model forecasts 34% congestion increase in 45 minutes. RL signal optimization recommended.",
                "confidence": 0.89,
                "explainable_factors": ["historical_patterns", "event_calendar", "weather"],
            },
            {
                "id": f"ins-{t}-2",
                "agent": "EnvironmentAI",
                "type": "forecast",
                "title": "AQI elevation expected near Industrial East",
                "detail": "PM2.5 rising trend detected. Wind shift may disperse pollutants by 18:00.",
                "confidence": 0.76,
                "explainable_factors": ["sensor_trend", "wind_model", "emission_baseline"],
            },
        ]
        if emergencies:
            insights.append({
                "id": f"ins-{t}-3",
                "agent": "EmergencyOrchestrator",
                "type": "alert",
                "title": f"Multi-agent response coordinated for {emergencies[0]['type']}",
                "detail": emergencies[0]["ai_recommendation"],
                "confidence": emergencies[0]["confidence"],
                "explainable_factors": ["cv_detection", "iot_sensors", "historical_incidents"],
            })
        return insights

    def _update_drones(self, t) -> list[dict]:
        result = []
        for d in DRONES:
            lat = settings.CITY_CENTER_LAT + 0.01 * math.sin(t / 5 + hash(d["id"]) % 10)
            lng = settings.CITY_CENTER_LNG + 0.01 * math.cos(t / 5 + hash(d["id"]) % 10)
            result.append({
                **d,
                "lat": lat,
                "lng": lng,
                "speed_kmh": 35 if d["status"] != "standby" else 0,
                "mission": d["status"],
                "detected_objects": random.randint(2, 18) if d["status"] != "standby" else 0,
            })
        return result

    def _infrastructure_state(self, t) -> dict:
        signals = []
        for s in SIGNALS:
            phases = ["green", "yellow", "red"]
            signals.append({
                **s,
                "phase": phases[(t + hash(s["id"]) % 3) % 3],
                "optimized_by_rl": t % 5 == 0,
                "throughput_vph": 800 + random.randint(-100, 200),
            })
        return {
            "signals": signals,
            "smart_lights": {"active": 3420, "energy_saved_kwh": round(1240 + t * 0.5, 0)},
            "parking": {"occupancy_pct": 62 + random.randint(-8, 8), "available_spots": 1847},
            "grid_load_mw": round(450 + 30 * math.sin(t / 12), 1),
        }

    def _traffic_heatmap(self) -> list[dict]:
        points = []
        for _ in range(40):
            points.append({
                "lat": settings.CITY_CENTER_LAT + random.uniform(-0.03, 0.03),
                "lng": settings.CITY_CENTER_LNG + random.uniform(-0.03, 0.03),
                "intensity": random.random(),
            })
        return points

    def _crowd_events(self) -> list[dict]:
        return [
            {"name": "Tech Summit", "zone": "tech", "attendance": 4200, "risk": "low"},
            {"name": "Harbor Festival", "zone": "harbor", "attendance": 8500, "risk": "medium"},
        ]

    def _env_forecast(self) -> list[dict]:
        return [
            {"hour": h, "aqi": int(50 + 20 * math.sin(h / 4))} for h in range(6)
        ]

    def _digital_twin_state(self, traffic, pollution) -> dict:
        return {
            "sync_status": "live",
            "sensor_sync_pct": 99.2,
            "layers": {
                "traffic": True,
                "environment": True,
                "crowd": True,
                "infrastructure": True,
                "emergency": True,
            },
            "buildings_active": 2847,
            "prediction_horizon_min": 120,
        }

    def _notifications(self, emergencies) -> list[dict]:
        notifs = []
        for e in emergencies:
            notifs.append({
                "id": e["id"],
                "level": "critical" if e["severity"] == "critical" else "warning",
                "message": f"{e['type'].upper()}: {e['description'][:60]}...",
                "timestamp": e["timestamp"],
            })
        if random.random() > 0.85:
            notifs.append({
                "id": str(uuid.uuid4())[:8],
                "level": "info",
                "message": "AI report generated: Urban Pattern Analysis Q2",
                "timestamp": self._time(),
            })
        return notifs


simulator = CitySimulator()
