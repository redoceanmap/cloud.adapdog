from __future__ import annotations

from abc import ABC, abstractmethod

from users.domain.entities.pet_activity_entity import PetActivity


class PetActivityUseCase(ABC):
    """반려동물 행동 기록 입력 포트."""

    @abstractmethod
    async def record(self, pet_id: int, facility_id: int, action_type: str) -> PetActivity:
        """반려동물의 시설 방문/저장 행동을 기록한다."""
        ...

    @abstractmethod
    async def list_by_pet(self, pet_id: int) -> list[PetActivity]:
        ...
