from __future__ import annotations

from abc import ABC, abstractmethod

from users.domain.entities.pet_activity_entity import PetActivity


class PetActivityPort(ABC):
    """반려동물 행동 저장/조회 출력 포트. 구현체(인메모리/DB)는 repository에 둔다."""

    @abstractmethod
    async def save(self, activity: PetActivity) -> PetActivity:
        """행동을 저장하고 id·occurred_at이 채워진 엔티티를 반환한다."""
        ...

    @abstractmethod
    async def find_by_pet(self, pet_id: int) -> list[PetActivity]:
        ...
