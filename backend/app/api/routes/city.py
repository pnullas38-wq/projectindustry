from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserInDB
from app.services.city_simulator import simulator, ZONES, CAMERAS

router = APIRouter(prefix="/city", tags=["Smart City"])


@router.get("/snapshot")
async def city_snapshot(_: UserInDB = Depends(get_current_user)):
    return simulator.generate_snapshot()


@router.get("/zones")
async def get_zones():
    return {"zones": ZONES}


@router.get("/cameras")
async def get_cameras(_: UserInDB = Depends(get_current_user)):
    return {"cameras": CAMERAS}


@router.get("/health")
async def city_health():
    snap = simulator.generate_snapshot()
    return {"status": "operational", "health_score": snap["kpis"]["city_health_score"]}
