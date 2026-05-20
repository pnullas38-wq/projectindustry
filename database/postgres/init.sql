-- NEXUS Digital Twin - PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'operator',
    full_name VARCHAR(128),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE city_zones (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    zone_type VARCHAR(64) DEFAULT 'mixed'
);

CREATE TABLE traffic_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id VARCHAR(64) REFERENCES city_zones(id),
    vehicle_count INT,
    congestion_pct DOUBLE PRECISION,
    avg_speed_kmh DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE environment_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id VARCHAR(64) REFERENCES city_zones(id),
    aqi INT,
    pm25 DOUBLE PRECISION,
    noise_db DOUBLE PRECISION,
    temp_c DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE emergencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    zone_id VARCHAR(64),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    description TEXT,
    ai_recommendation TEXT,
    confidence DOUBLE PRECISION,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(64),
    insight_type VARCHAR(64),
    title VARCHAR(256),
    detail TEXT,
    confidence DOUBLE PRECISION,
    explainable_factors JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drones (
    id VARCHAR(64) PRIMARY KEY,
    status VARCHAR(32),
    battery_pct INT,
    altitude_m INT,
    last_lat DOUBLE PRECISION,
    last_lng DOUBLE PRECISION,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_traffic_zone_time ON traffic_readings(zone_id, recorded_at DESC);
CREATE INDEX idx_env_zone_time ON environment_readings(zone_id, recorded_at DESC);
CREATE INDEX idx_emergencies_active ON emergencies(resolved, created_at DESC);

INSERT INTO city_zones (id, name, lat, lng, zone_type) VALUES
('downtown', 'Downtown Core', 40.7128, -74.0060, 'commercial'),
('financial', 'Financial District', 40.7074, -74.0113, 'commercial'),
('harbor', 'Harbor Zone', 40.7022, -74.0158, 'industrial'),
('tech', 'Innovation Hub', 40.7282, -73.9942, 'tech'),
('residential', 'Residential North', 40.7614, -73.9776, 'residential'),
('industrial', 'Industrial East', 40.7420, -73.9650, 'industrial');
