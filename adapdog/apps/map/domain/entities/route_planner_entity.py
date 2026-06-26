from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.value_objects.route_planner_vo import (
    LodgingOption,
    PlannerStage,
    TransportMode,
)


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
class TripPlan:
    """대화형 플래너의 누적 상태(애그리거트).

    대화가 길어져도 "지금까지 정해진 것"을 이 상태가 보존한다. 서버는 무상태이고,
    클라이언트가 매 턴 직전 상태를 동봉해 왕복한다. 상태 전이(다음에 무엇을 물을지)는
    LLM이 아니라 next_stage() 규칙이 결정한다(데모 안정성).

    데모 고정: origin="서울", destination="전주".
    """

    origin: str = "서울"
    destination: Optional[str] = None
    transport: TransportMode = TransportMode.UNSET
    lodging: LodgingOption = LodgingOption.UNSET
    nights: int = 0  # 묵는 박 수(0=당일치기). OVERNIGHT일 때 1 이상.

    def next_stage(self) -> PlannerStage:
        """다음에 채울 슬롯을 결정한다(목적지→이동수단→숙박→완성)."""
        if not self.destination:
            return PlannerStage.ASK_DESTINATION
        if self.transport is TransportMode.UNSET:
            return PlannerStage.ASK_TRANSPORT
        if self.lodging is LodgingOption.UNSET:
            return PlannerStage.ASK_LODGING
        return PlannerStage.READY

    @property
    def is_ready(self) -> bool:
        return self.next_stage() is PlannerStage.READY


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
