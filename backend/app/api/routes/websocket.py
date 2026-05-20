import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.config import get_settings
from app.services.city_simulator import simulator

router = APIRouter(tags=["WebSocket"])
settings = get_settings()

active_connections: list[WebSocket] = []


@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            snapshot = simulator.generate_snapshot()
            await websocket.send_json({
                "type": "city_update",
                "data": snapshot,
            })
            await asyncio.sleep(settings.SIMULATION_INTERVAL_SEC)
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)


@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            snap = simulator.generate_snapshot()
            if snap["notifications"]:
                await websocket.send_json({
                    "type": "notifications",
                    "data": snap["notifications"],
                })
            await asyncio.sleep(settings.SIMULATION_INTERVAL_SEC)
    except WebSocketDisconnect:
        pass
