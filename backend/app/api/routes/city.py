from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.services.city_simulator import simulator, ZONES, CAMERAS

router = APIRouter(prefix="/city", tags=["Smart City"])


@router.get("/snapshot")
async def city_snapshot(_: User = Depends(get_current_user)):
    return simulator.generate_snapshot()


@router.get("/snapshot/public")
async def city_snapshot_public():
    """Unauthenticated snapshot for fallback when API routing or auth fails."""
    return simulator.generate_snapshot()


@router.get("/zones")
async def get_zones():
    return {"zones": ZONES}


@router.get("/cameras")
async def get_cameras(_: User = Depends(get_current_user)):
    return {"cameras": CAMERAS}


@router.get("/health")
async def city_health():
    snap = simulator.generate_snapshot()
    return {"status": "operational", "health_score": snap["kpis"]["city_health_score"]}
