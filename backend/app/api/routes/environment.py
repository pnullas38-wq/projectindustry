from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserInDB
from app.services.city_simulator import simulator

router = APIRouter(prefix="/environment", tags=["Environment Analytics"])


@router.get("/aqi")
async def aqi_monitoring(_: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return snap["environment"]


@router.get("/forecast")
async def pollution_forecast(_: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {
        "model": "LSTM-EnvForecast",
        "zones": snap["environment"]["zones"],
        "forecast_6h": snap["environment"]["forecast"],
        "confidence": 0.81,
    }
