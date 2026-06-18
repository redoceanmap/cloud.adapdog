from __future__ import annotations

from abc import ABC, abstractmethod

from users.domain.entities.breed_catalog_entity import BreedProfile


class BreedCatalogUseCase(ABC):
    """견종 표준정보 조회 입력 포트.

    pet 슬라이스가 이 use case를 주입받아 반려동물 등록 시 크기·체질·기질을
    자동으로 채운다.
    """

    @abstractmethod
    async def lookup(self, breed: str) -> BreedProfile:
        """견종명으로 표준 프로필을 조회한다. 미등록 견종도 기본값으로 항상 반환한다."""
        ...
