"""MQTT IoT sensor simulator for digital twin sync."""
import json
import random
import time
from datetime import datetime, timezone

try:
    import paho.mqtt.client as mqtt
    MQTT_AVAILABLE = True
except ImportError:
    MQTT_AVAILABLE = False

SENSOR_TYPES = ["traffic", "air_quality", "noise", "temperature", "crowd", "parking"]


def generate_reading(sensor_id: str, sensor_type: str) -> dict:
    base = {
        "sensor_id": sensor_id,
        "type": sensor_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if sensor_type == "traffic":
        base["value"] = {"vehicles_per_min": random.randint(10, 120), "avg_speed": random.randint(15, 65)}
    elif sensor_type == "air_quality":
        base["value"] = {"aqi": random.randint(30, 120), "pm25": round(random.uniform(10, 55), 1)}
    elif sensor_type == "noise":
        base["value"] = {"db": round(random.uniform(45, 85), 1)}
    elif sensor_type == "crowd":
        base["value"] = {"count": random.randint(50, 900)}
    else:
        base["value"] = {"reading": round(random.uniform(0, 100), 2)}
    return base


class SensorSimulator:
    def __init__(self, broker: str = "localhost", port: int = 1883):
        self.broker = broker
        self.port = port
        self.client = None

    def connect(self):
        if not MQTT_AVAILABLE:
            return False
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        try:
            self.client.connect(self.broker, self.port, 60)
            return True
        except Exception:
            return False

    def publish_loop(self, interval: float = 2.0):
        sensors = [(f"sensor-{i:03d}", random.choice(SENSOR_TYPES)) for i in range(1, 21)]
        while True:
            for sid, stype in sensors:
                reading = generate_reading(sid, stype)
                topic = f"nexus/iot/{stype}/{sid}"
                if self.client:
                    self.client.publish(topic, json.dumps(reading))
            time.sleep(interval)


if __name__ == "__main__":
    sim = SensorSimulator()
    if sim.connect():
        print("Publishing IoT sensor data to MQTT...")
        sim.publish_loop()
    else:
        print("MQTT unavailable — run with broker or use backend WebSocket simulator")
