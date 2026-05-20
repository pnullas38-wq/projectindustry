"""Re-export city simulator for standalone simulation runs."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from app.services.city_simulator import simulator, CitySimulator  # noqa: E402

if __name__ == "__main__":
    import json
    print(json.dumps(simulator.generate_snapshot(), indent=2))
