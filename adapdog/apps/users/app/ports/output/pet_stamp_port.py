from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.domain.entities.pet_stamp_entity import PetStamp


class PetStampPort(ABC):
    """수집 스탬프 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_stamps(self, pet_id: Optional[int]) -> list[PetStamp]:
        """반려동물(선택)로 수집 스탬프 도메인 엔티티를 조회한다."""
        ...
