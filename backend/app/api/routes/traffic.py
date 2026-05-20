from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.security import get_current_user
from app.models.user import User
from app.services.city_simulator import simulator

router = APIRouter(prefix="/traffic", tags=["Traffic Intelligence"])


class SignalOptimizeRequest(BaseModel):
    intersection_id: str
    strategy: str = "rl_optimization"


@router.get("/analytics")
async def traffic_analytics(_: User = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return snap["traffic"]


@router.get("/forecast")
async def traffic_forecast(_: User = Depends(get_current_user)):
    return {
        "model": "LSTM-Traffic-v2",
        "horizon_minutes": 120,
        "predictions": [
            {"zone": "downtown", "congestion_pct": [45, 52, 61, 58, 49]},
            {"zone": "financial", "congestion_pct": [38, 44, 55, 72, 68]},
            {"zone": "harbor", "congestion_pct": [22, 25, 28, 30, 27]},
        ],
        "confidence": 0.87,
    }


@router.post("/signals/optimize")
async def optimize_signals(req: SignalOptimizeRequest, _: User = Depends(get_current_user)):
    return {
        "intersection_id": req.intersection_id,
        "strategy": req.strategy,
        "status": "optimized",
        "rl_reward": 0.94,
        "estimated_improvement_pct": 18.5,
        "new_phase_timing": {"green": 42, "yellow": 5, "red": 33},
    }


@router.get("/accidents")
async def accident_detection(_: User = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    accidents = [
        z for z in snap["traffic"]["zones"] if z.get("incidents", 0) > 0
    ]
    return {"detected": len(accidents), "zones": accidents, "cv_model": "YOLOv8-AccidentNet"}
