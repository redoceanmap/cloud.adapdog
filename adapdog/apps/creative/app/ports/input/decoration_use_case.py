from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.app.dtos.decoration_dto import DecorationDto


class DecorationUseCase(ABC):
    """꾸미기 결과 조회 입력 포트."""

    @abstractmethod
    async def list_decorations(self, pet_id: Optional[int] = None) -> list[DecorationDto]:
        """반려동물(선택)로 꾸미기 결과를 조회한다. pet_id가 없으면 전체."""
        ...
