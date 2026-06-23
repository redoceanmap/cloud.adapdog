from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.value_objects.pet_place_vo import PetSize


@dataclass(frozen=True)
class TrailDto:
    """추천 둘레길(좌표 없는 코스) 응답 항목."""

    name: str
    intro: str
    length_km: Optional[float]
    duration: str
    start_point: str
    waypoints: str


@dataclass(frozen=True)
class CourseBrief:
    """동선 생성 요청 (인터랙터 → 에이전트, 인바운드 스키마와 분리)."""

    region: str
    days: int
    pet_size: PetSize
    pet_breed: Optional[str]


@dataclass(frozen=True)
class PlannedStop:
    """에이전트가 정한 한 정류장."""

    id: int
    name: str
    category: str
    latitude: float
    longitude: float


@dataclass(frozen=True)
class AgentCoursePlan:
    """에이전트의 동선 생성 결과 (순서 있는 정류장 + 설명 + 추천 둘레길)."""

    stops: list[PlannedStop]
    narrative: str
    trails: list[TrailDto] = field(default_factory=list)


@dataclass(frozen=True)
class RouteStopDto:
    order: int
    name: str
    category: str
    latitude: float
    longitude: float
    distance_from_prev_km: float = 0.0
    similarity: int = 0  # 닮은친구% — 같은 크기 코호트의 방문 인기도


@dataclass(frozen=True)
class RoutePlanResponse:
    region: str
    pet_size: str
    stop_count: int
    total_distance_km: float
    summary: str
    stops: list[RouteStopDto]
    recommended_trails: list[TrailDto] = field(default_factory=list)
