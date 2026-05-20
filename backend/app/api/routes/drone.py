from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.services.city_simulator import simulator

router = APIRouter(prefix="/drones", tags=["Autonomous Drone Integration"])


@router.get("/fleet")
async def drone_fleet(_: User = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {"drones": snap["drones"]}


@router.get("/feeds/{drone_id}")
async def drone_feed(drone_id: str, _: User = Depends(get_current_user)):
    return {
        "drone_id": drone_id,
        "feed_url": f"/api/v1/drones/feeds/{drone_id}/stream",
        "resolution": "4K",
        "ai_overlay": True,
        "tracked_objects": [
            {"class": "vehicle", "confidence": 0.94, "bbox": [120, 80, 200, 160]},
            {"class": "person", "confidence": 0.88, "bbox": [300, 150, 340, 220]},
        ],
        "status": "live",
    }
