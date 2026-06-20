from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from users.domain.entities.breed_catalog_entity import BreedProfile


class BreedCatalogPort(ABC):
    """견종 표준정보 조회 출력 포트.

    구현체(목/DB)는 repository에 둔다. 등록 견종이 없으면 None을 반환하고,
    기본값 처리는 인터랙터가 맡는다.
    """

    @abstractmethod
    async def lookup(self, breed: str) -> Optional[BreedProfile]:
        """견종명으로 표준 프로필을 조회한다(없으면 None)."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="users",
            feature="breed_catalog",
            message="견종 표준정보 조회 기능입니다. 연동 정상!",
            trail=["repository"],
        )
