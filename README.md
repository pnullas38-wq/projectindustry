# NEXUS Digital Twin Smart City Platform

Enterprise-grade AI-powered Digital Twin for real-time urban intelligence — traffic, crowds, environment, emergencies, drones, and predictive analytics in a futuristic command-center UI.

![NEXUS Platform](docs/assets/preview-placeholder.png)

## Features

| Module | Capabilities |
|--------|-------------|
| **Smart City Dashboard** | Holographic HUD, live KPIs, glassmorphism UI, WebSocket sync |
| **Traffic Intelligence** | YOLOv8 detection, congestion heatmaps, LSTM forecast, RL signal optimization |
| **Crowd Analytics** | Density estimation, event monitoring, suspicious activity scoring |
| **Environment** | AQI, noise, temperature, 6h pollution forecast |
| **Emergency AI** | Accident/fire/medical detection, hotspots, AI recommendations |
| **Digital Twin** | 3D city (Three.js), geospatial map (Leaflet), layer toggles |
| **Drone Fleet** | Live fleet status, aerial analytics simulation |
| **AI Engine** | Multi-agent insights, chatbot, explainable AI, report generation |
| **Advanced** | Voice control, JWT RBAC, real-time notifications |

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Three.js, Framer Motion, Recharts, Leaflet
- **Backend:** FastAPI, WebSockets, JWT
- **AI/ML:** YOLOv8, OpenCV, LSTM forecasting, RL traffic signals (see `ai_models/`)
- **Data:** PostgreSQL, MongoDB, Redis
- **IoT:** MQTT sensor simulator
- **DevOps:** Docker Compose, Kubernetes manifests, Nginx

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- (Optional) Docker & Docker Compose

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
pip install -r requirements-minimal.txt
cd ..
set PYTHONPATH=backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend
```

API docs: http://localhost:8000/api/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Demo Login

| User | Password | Role |
|------|----------|------|
| admin | admin123 | admin |
| operator | ops123 | operator |
| analyst | ai123 | analyst |

### Docker (Full Stack)

```bash
cd docker
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Nginx proxy: http://localhost:80

## Project Structure

```
nexus-digital-twin-smart-city/
├── frontend/          # React command center UI
├── backend/           # FastAPI microservices API
├── ai_models/         # YOLOv8, LSTM, RL modules
├── iot/               # MQTT sensor simulator
├── database/          # PostgreSQL & MongoDB schemas
├── docker/            # Docker Compose, K8s, Nginx
├── services/          # Shared service definitions
├── analytics/         # Analytics pipelines
├── maps/              # Geospatial utilities
├── simulation/        # City simulation utilities
└── docs/              # Architecture documentation
```

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/login` | JWT authentication |
| `GET /api/v1/city/snapshot` | Full city state |
| `GET /api/v1/traffic/analytics` | Traffic intelligence |
| `GET /api/v1/crowd/density` | Crowd analytics |
| `GET /api/v1/environment/aqi` | Environmental data |
| `GET /api/v1/emergency/active` | Active emergencies |
| `GET /api/v1/drones/fleet` | Drone fleet status |
| `POST /api/v1/ai/chat` | AI assistant |
| `WS /api/v1/ws/live` | Real-time city stream |

## AI Models

Install full ML stack: `pip install -r backend/requirements.txt`

- `ai_models/vision/yolo_detector.py` — Vehicle, crowd, fire detection
- `ai_models/forecasting/lstm_traffic.py` — Traffic & pollution forecasting
- `ai_models/rl/traffic_signal_rl.py` — Signal timing optimization

## Voice Commands

Enable voice in the sidebar, then say: *traffic*, *emergency*, *environment*, *drones*, *overview*, *twin*, *ai*.

## License

MIT — Built for academic & enterprise smart city demonstrations.
