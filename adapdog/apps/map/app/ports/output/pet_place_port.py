from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.entities.pet_place_entity import PetFriendlyPlace


class PetFriendlyPlacePort(ABC):
    """반려동물 동반 가능 시설 조회 출력 포트.

    구현체(목/odcloud/CSV/DB)는 repository에 둔다. 인터랙터는 이 추상에만 의존한다.
    """

    @abstractmethod
    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        """지역명으로 반려동물 동반 가능 시설 목록을 조회한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="pet_place",
            message="반려동물 동반시설 조회 기능입니다. 연동 정상!",
            trail=["repository"],
        )
