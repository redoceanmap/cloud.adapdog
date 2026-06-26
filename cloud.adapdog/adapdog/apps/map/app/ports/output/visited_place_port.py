from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.entities.visited_place_entity import VisitedPlace


class VisitedPlacePort(ABC):
    """발자국(방문 시설) 조회 출력 포트. 구현체(DB read 모델/빈 폴백)는 repository에 둔다."""

    @abstractmethod
    async def list_visited(self, pet_id: int, limit: int) -> list[VisitedPlace]:
        """반려동물이 다녀온 시설을 첫 방문 순으로 집계해 반환한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="visited_place",
            message="반려동물 발자국(방문 시설) 지도 기능입니다. 연동 정상!",
            trail=["repository"],
        )
