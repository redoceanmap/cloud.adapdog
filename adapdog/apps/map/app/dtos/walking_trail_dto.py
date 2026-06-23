from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class WalkingTrailDto:
    """둘레길 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    name: str
    region: str
    distance_km: float
    difficulty: str
    duration: str
    description: str
    route_info: str = ""
