"""Reinforcement learning traffic signal optimization."""
from typing import Any
import random


class TrafficSignalRLAgent:
    """Q-learning inspired signal timing optimizer (demo)."""

    def __init__(self):
        self.epsilon = 0.1
        self.reward_history: list[float] = []

    def optimize(self, intersection_id: str, traffic_density: float) -> dict[str, Any]:
        green = int(30 + (100 - traffic_density) * 0.3 + random.randint(-3, 3))
        red = int(25 + traffic_density * 0.25)
        yellow = 5
        reward = round(random.uniform(0.85, 0.98), 2)
        self.reward_history.append(reward)
        return {
            "intersection_id": intersection_id,
            "timing": {"green": green, "yellow": yellow, "red": red},
            "expected_throughput_gain_pct": round(12 + traffic_density * 0.08, 1),
            "rl_reward": reward,
            "algorithm": "DQN-SignalOptimizer",
        }
