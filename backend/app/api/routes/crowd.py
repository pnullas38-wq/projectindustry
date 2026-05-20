from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.services.city_simulator import simulator

router = APIRouter(prefix="/crowd", tags=["Crowd Analytics"])


@router.get("/density")
async def crowd_density(_: User = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return snap["crowd"]


@router.get("/suspicious")
async def suspicious_activity(_: User = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    alerts = [
        z for z in snap["crowd"]["zones"]
        if z.get("suspicious_score", 0) > 0.25
    ]
    return {"alerts": alerts, "model": "CrowdNet-v3", "threshold": 0.25}
