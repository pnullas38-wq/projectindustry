from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel
from app.core.security import get_current_user, UserInDB
from app.services.city_simulator import simulator

router = APIRouter(prefix="/ai", tags=["AI Analytics Engine"])


class ChatRequest(BaseModel):
    message: str
    context: str = "city_operations"


class ReportRequest(BaseModel):
    report_type: str = "daily_operations"
    zones: list[str] = []


@router.get("/insights")
async def ai_insights(_: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {"insights": snap["ai_insights"], "multi_agent_status": "active"}


@router.post("/chat")
async def ai_assistant(req: ChatRequest, _: UserInDB = Depends(get_current_user)):
    responses = {
        "traffic": "Traffic AI: Downtown congestion at 52%. RL optimization applied to 3 intersections. Predicted peak in 45 min.",
        "emergency": "Emergency AI: 1 active incident. EMS dispatched. Drone Alpha providing aerial surveillance.",
        "pollution": "Environment AI: City-wide AQI average is moderate. Industrial East trending upward — recommend emission controls.",
        "default": "NEXUS AI Assistant: All systems nominal. City health score stable. Ask about traffic, emergencies, pollution, or drones.",
    }
    key = "default"
    msg = req.message.lower()
    for k in responses:
        if k in msg:
            key = k
            break
    return {
        "response": responses[key],
        "agent": "NEXUS-Orchestrator",
        "confidence": 0.92,
        "sources": ["digital_twin", "iot_sensors", "cv_feeds", "predictive_models"],
    }


@router.post("/reports/generate")
async def generate_report(req: ReportRequest, _: UserInDB = Depends(get_current_user)):
    snap = simulator.generate_snapshot()
    return {
        "report_type": req.report_type,
        "generated_at": snap["timestamp"],
        "summary": f"City health: {snap['kpis']['city_health_score']}. "
                   f"Congestion: {snap['kpis']['avg_congestion_pct']}%. "
                   f"Emergencies: {snap['kpis']['active_emergencies']}.",
        "sections": ["traffic", "environment", "crowd", "infrastructure", "ai_insights"],
        "ai_insights_count": len(snap["ai_insights"]),
    }


@router.post("/vision/detect")
async def vision_detect(_: UserInDB = Depends(get_current_user), file: UploadFile = File(None)):
    return {
        "model": "YOLOv8-Nexus",
        "detections": [
            {"class": "car", "confidence": 0.96, "bbox": [100, 120, 180, 200]},
            {"class": "truck", "confidence": 0.89, "bbox": [250, 100, 350, 220]},
            {"class": "person", "confidence": 0.91, "bbox": [400, 180, 430, 260]},
        ],
        "inference_ms": 42,
        "note": "Demo mode — connect weights in ai_models/ for production inference",
    }


@router.get("/explain/{insight_id}")
async def explainable_ai(insight_id: str, _: UserInDB = Depends(get_current_user)):
    return {
        "insight_id": insight_id,
        "explanation": "Model weighted historical traffic (40%), live sensor fusion (35%), and weather API (25%).",
        "feature_importance": {
            "historical_patterns": 0.40,
            "live_sensors": 0.35,
            "weather": 0.25,
        },
        "shap_available": True,
    }
