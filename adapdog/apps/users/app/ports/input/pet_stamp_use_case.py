from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.app.dtos.pet_stamp_dto import PetStampDto


class PetStampUseCase(ABC):
    """수집 스탬프 조회 입력 포트."""

    @abstractmethod
    async def list_stamps(self, pet_id: Optional[int] = None) -> list[PetStampDto]:
        """반려동물(선택)로 수집 스탬프를 조회한다. pet_id가 없으면 전체."""
        ...
