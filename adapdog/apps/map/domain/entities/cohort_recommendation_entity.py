from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass
class RecommendedFacility:
    """코호트 추천 결과 한 건 — 시설 + 코호트 행동 점수."""

    facility_id: int
    name: str
    category: Optional[str]
    coordinate: Coordinate
    road_address: Optional[str]
    score: int   # 코호트가 이 시설에 남긴 방문/저장 횟수
