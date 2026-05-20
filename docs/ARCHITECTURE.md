# NEXUS Architecture

## System Overview

```mermaid
flowchart TB
    subgraph Client
        UI[React Command Center]
        WS[WebSocket Client]
        MAP[Leaflet + Three.js]
    end

    subgraph API
        FAST[FastAPI Gateway]
        AUTH[JWT Auth]
        LIVE[WS Live Stream]
    end

    subgraph AI
        YOLO[YOLOv8 Vision]
        LSTM[LSTM Forecast]
        RL[RL Signal Optimizer]
        AGENTS[Multi-Agent Insights]
    end

    subgraph Data
        PG[(PostgreSQL)]
        MONGO[(MongoDB)]
        REDIS[(Redis)]
    end

    subgraph IoT
        MQTT[MQTT Broker]
        SIM[Sensor Simulator]
    end

    UI --> FAST
    WS --> LIVE
    LIVE --> SIM
    FAST --> AUTH
    FAST --> YOLO
    FAST --> LSTM
    FAST --> RL
    FAST --> AGENTS
    FAST --> PG
    FAST --> MONGO
    SIM --> MQTT
    MQTT --> FAST
```

## Data Flow

1. **IoT Simulator** publishes sensor readings to MQTT (or backend internal simulator).
2. **City Simulator** fuses telemetry into a unified digital twin snapshot every 2s.
3. **WebSocket** pushes snapshots to all connected command center clients.
4. **AI modules** enrich snapshots with predictions, CV detections, and RL optimizations.
5. **PostgreSQL** stores historical readings; **MongoDB** stores CV detections and AI reports.

## Security

- JWT bearer tokens with role-based access (admin, operator, analyst)
- CORS restricted in production via environment config
- Secrets via `.env` — never commit credentials

## Deployment

- **Development:** Uvicorn + Vite dev servers
- **Docker Compose:** Full stack with Postgres, MongoDB, Redis, MQTT, Nginx
- **Kubernetes:** Horizontal pod autoscaling for backend/frontend (`docker/kubernetes/`)
