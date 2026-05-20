from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserInDB
from app.services.city_simulator import simulator

router = APIRouter(prefix="/emergency", tags=["Emergency Response AI"])


@router.get("/active")
async def active_emergencies(_: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {"emergencies": snap["emergencies"], "count": len(snap["emergencies"])}


@router.get("/hotspots")
async def emergency_hotspots(_: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {
        "hotspots": [
            {"lat": e["lat"], "lng": e["lng"], "severity": e["severity"], "type": e["type"]}
            for e in snap["emergencies"]
        ]
    }


@router.get("/predictions")
async def disaster_prediction(_: UserInDB = Depends(get_current_user)):
    return {
        "predictions": [
            {"type": "flood_risk", "zone": "harbor", "probability": 0.23, "window_hours": 48},
            {"type": "heat_wave", "zone": "residential", "probability": 0.41, "window_hours": 72},
        ],
        "model": "EmergencyPredictor-LSTM",
    }
