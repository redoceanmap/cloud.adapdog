from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass
class VisitedPlace:
    """반려동물이 실제로 다녀온 시설 한 건 — '발자국' 지도의 점.

    pet_activity(action_type=visit)를 시설별로 집계한 결과. 같은 곳을 여러 번
    방문하면 visit_count로 누적되고, first_visited_at은 첫 방문 시각이다.
    """

    facility_id: int
    name: str
    category: Optional[str]
    coordinate: Coordinate
    region: Optional[str]
    road_address: Optional[str]
    visit_count: int
    first_visited_at: Optional[datetime]
