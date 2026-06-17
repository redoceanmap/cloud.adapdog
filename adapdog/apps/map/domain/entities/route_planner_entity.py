from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.entities.pet_place_entity import PetFriendlyPlace


@dataclass(frozen=True)
class Trail:
    """관광 둘레길 — 좌표 없는 선형 코스(시작→경유→종료).

    원천: 전국길관광정보표준데이터. 점(시설)이 아니라 코스라 동선의 정류장이 아닌
    '추천 산책 코스'로 제공된다.
    """

    name: str
    intro: str
    length_km: Optional[float]
    duration: str
    start_point: str
    region: str          # 시작지점 주소(시도/시군구 매칭용)
    waypoints: str       # 경로정보(경유지)


@dataclass
class RouteCourse:
    """동선 코스 — 순서가 있는 정류장(시설)들 + 동선 행위."""

    stops: list[PetFriendlyPlace] = field(default_factory=list)

    @property
    def stop_count(self) -> int:
        return len(self.stops)

    def total_distance_km(self) -> float:
        """정류장을 순서대로 이동할 때의 총 거리(km)."""
        return round(
            sum(a.coordinate.distance_km_to(b.coordinate) for a, b in zip(self.stops, self.stops[1:])),
            2,
        )
