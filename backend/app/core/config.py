import os
from functools import lru_cache

from pydantic_settings import BaseSettings


def _default_database_url() -> str:
    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL", "")
    # Vercel serverless: only /tmp is writable
    if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
        return "sqlite+aiosqlite:////tmp/nexus_auth.db"
    return "sqlite+aiosqlite:///./data/nexus_auth.db"


class Settings(BaseSettings):
    APP_NAME: str = "NEXUS Digital Twin Smart City Platform"
    # Vercel Services mount backend at BACKEND_ROUTE_PREFIX (e.g. /_/backend)
    BACKEND_ROUTE_PREFIX: str = ""
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "nexus-smart-city-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DEBUG: bool = False

    DATABASE_URL: str = _default_database_url()
    POSTGRES_URL: str = "postgresql+asyncpg://nexus:nexus@postgres:5432/nexus_city"
    MONGODB_URL: str = "mongodb://nexus:nexus@mongodb:27017"
    MONGODB_DB: str = "nexus_analytics"
    REDIS_URL: str = "redis://redis:6379/0"

    MQTT_BROKER: str = "mqtt"
    MQTT_PORT: int = 1883

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
    ]

    CITY_CENTER_LAT: float = 40.7128
    CITY_CENTER_LNG: float = -74.0060
    SIMULATION_INTERVAL_SEC: float = 2.0

    class Config:
        env_file = ".env"

    def route(self, path: str) -> str:
        """Prefix paths for Vercel service routing (e.g. /_/backend/health)."""
        prefix = self.BACKEND_ROUTE_PREFIX.rstrip("/")
        return f"{prefix}{path}" if prefix else path


@lru_cache
def get_settings() -> Settings:
    return Settings()
