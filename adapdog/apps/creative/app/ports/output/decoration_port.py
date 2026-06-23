from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.domain.entities.decoration_entity import Decoration


class DecorationPort(ABC):
    """꾸미기 결과 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_decorations(self, pet_id: Optional[int]) -> list[Decoration]:
        """반려동물(선택)로 꾸미기 결과 도메인 엔티티를 조회한다."""
        ...
