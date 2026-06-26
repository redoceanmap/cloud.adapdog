from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ItineraryStop:
    """저장된 코스의 한 경유지 — itinerary 도메인에 종속(독립 슬라이스 아님).

    프랙탈 규칙상 별도 슬라이스로 분리하지 않고 Itinerary의 구성요소로 둔다.
    """

    order: int
    name: str
    category: str
    latitude: float
    longitude: float


@dataclass(frozen=True)
class Itinerary:
    """저장된 추천 코스 — C(코스저장)의 한 항목.

    prompt_text로 생성된 코스를 사용자가 저장(is_saved)한 결과. stops는 경유지 순서 목록.
    """

    id: int
    pet_id: int
    title: str
    region: str
    prompt_text: str
    is_saved: bool
    created_at: str  # ISO yyyy-mm-dd
    stops: list[ItineraryStop]
