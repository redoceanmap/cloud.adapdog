from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.domain.entities.pet_persona_entity import PetPersona


class PetPersonaPort(ABC):
    """페르소나 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_persona(self, pet_id: int) -> Optional[PetPersona]:
        """반려동물의 페르소나 도메인 엔티티를 조회한다. 없으면 None."""
        ...
