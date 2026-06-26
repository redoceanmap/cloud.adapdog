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
    departure_time: Optional[str] = None  # 서울 출발시각 "HH:MM" — 도착·식사시간 자동계산용.
    lodging: LodgingOption = LodgingOption.UNSET
    nights: int = 0  # 묵는 박 수(0=당일치기). OVERNIGHT일 때 1 이상.
    # 선택 슬롯(READY 게이트엔 미포함) — 대화에서 자연스럽게 추출되면 숙소 선택·동선·설명에 반영.
    lodging_pref: Optional[str] = None   # 숙소 취향·위치(예: "한옥마을 근처", "전주역 근처", 예약한 숙소명)
    interests: Optional[str] = None       # 여행 스타일·관심사(예: "맛집·카페", "문화·역사", "자연·힐링")
    pet_mobility: Optional[str] = None    # 이동 성향(예: "도보 위주", "광역 OK") — 동선 여유·범위 조정

    def next_stage(self) -> PlannerStage:
        """다음에 채울 필수 슬롯을 결정한다(목적지→이동수단→숙박→완성).

        시나리오 분석: 자연스러운 대화는 출발시각을 묻지 않는다(기본 오전 출발 가정).
        출발시각은 사용자가 말하면 받되 게이트는 아니다 — 코스 생성 최소 조건은 목적지·이동수단·숙박.
        """
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
