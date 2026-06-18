from __future__ import annotations

from abc import ABC, abstractmethod

from users.domain.entities.pet_entity import Pet


class PetPort(ABC):
    """반려동물 저장/조회 출력 포트. 구현체(인메모리/DB)는 repository에 둔다."""

    @abstractmethod
    async def save(self, pet: Pet) -> Pet:
        """반려동물을 저장하고 id가 채워진 엔티티를 반환한다."""
        ...

    @abstractmethod
    async def find_by_account(self, account_id: int) -> list[Pet]:
        ...
