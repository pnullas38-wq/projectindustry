from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from app.core.config import get_settings
from app.core.exceptions import integrity_exception_handler, validation_exception_handler
from app.api.routes import auth, city, traffic, crowd, environment, emergency, drone, ai, websocket
from app.db.database import AsyncSessionLocal, init_db
from app.services.user_seed import seed_default_users

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_default_users(session)
        await session.commit()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise AI-powered Digital Twin Smart City Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=settings.route("/api/docs"),
    redoc_url=settings.route("/api/redoc"),
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=prefix)
app.include_router(city.router, prefix=prefix)
app.include_router(traffic.router, prefix=prefix)
app.include_router(crowd.router, prefix=prefix)
app.include_router(environment.router, prefix=prefix)
app.include_router(emergency.router, prefix=prefix)
app.include_router(drone.router, prefix=prefix)
app.include_router(ai.router, prefix=prefix)
app.include_router(websocket.router, prefix=prefix)


@app.get(settings.route("/"))
async def root():
    return {
        "platform": settings.APP_NAME,
        "status": "online",
        "docs": settings.route("/api/docs"),
        "websocket": f"{prefix}/ws/live",
    }


@app.get(settings.route("/health"))
async def health():
    return {"status": "healthy", "service": "nexus-backend"}
