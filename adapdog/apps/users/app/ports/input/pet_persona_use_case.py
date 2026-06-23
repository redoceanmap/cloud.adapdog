from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.app.dtos.pet_persona_dto import PetPersonaDto


class PetPersonaUseCase(ABC):
    """페르소나 조회 입력 포트."""

    @abstractmethod
    async def get_persona(self, pet_id: int) -> Optional[PetPersonaDto]:
        """반려동물의 페르소나를 조회한다. 없으면 None."""
        ...
