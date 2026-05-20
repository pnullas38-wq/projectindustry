"""Vercel FastAPI entrypoint — re-exports the application instance."""
from app.main import app

__all__ = ["app"]
