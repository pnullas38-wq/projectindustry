"""YOLOv8 computer vision module for smart city detection."""
from typing import Any
import random

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False


class NexusVisionDetector:
    """Vehicle, crowd, fire/smoke, and accident detection."""

    CLASSES = ["car", "truck", "bus", "person", "bicycle", "fire", "smoke", "accident"]

    def __init__(self, model_path: str = "yolov8n.pt"):
        self.model = None
        if YOLO_AVAILABLE:
            try:
                self.model = YOLO(model_path)
            except Exception:
                self.model = None

    def detect(self, image_path: str | None = None) -> dict[str, Any]:
        if self.model and image_path:
            results = self.model(image_path)
            detections = []
            for r in results:
                for box in r.boxes:
                    detections.append({
                        "class": self.CLASSES[int(box.cls)] if int(box.cls) < len(self.CLASSES) else "object",
                        "confidence": float(box.conf),
                        "bbox": box.xyxy[0].tolist(),
                    })
            return {"detections": detections, "model": "YOLOv8", "mode": "live"}
        return self._demo_detections()

    def _demo_detections(self) -> dict[str, Any]:
        return {
            "detections": [
                {"class": c, "confidence": round(random.uniform(0.82, 0.99), 2),
                 "bbox": [random.randint(50, 400) for _ in range(4)]}
                for c in random.sample(["car", "truck", "person", "bus"], k=random.randint(2, 4))
            ],
            "model": "YOLOv8-Nexus-Demo",
            "mode": "simulated",
        }
