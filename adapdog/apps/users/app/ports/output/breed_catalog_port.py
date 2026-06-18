from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

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
