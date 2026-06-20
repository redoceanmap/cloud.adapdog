from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.entities.pet_place_entity import PetFriendlyPlace


class PetPlaceUseCase(ABC):
    """반려동물 동반시설 조회 입력 포트.

    다른 기능 슬라이스(route_planner, inclusive_filter, entry_verdict, safety_alert)가
    이 use case를 주입받아 시설 데이터를 재사용한다.
    """

    @abstractmethod
    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        """지역명으로 반려동물 동반 가능 시설(도메인 엔티티)을 조회한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
