from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.entities.visited_place_entity import VisitedPlace


class VisitedPlaceUseCase(ABC):
    """발자국(방문 시설) 조회 입력 포트."""

    @abstractmethod
    async def list_footprint(self, pet_id: int, limit: int = 50) -> list[VisitedPlace]:
        """반려동물이 다녀온 시설을 첫 방문 순으로 반환한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
