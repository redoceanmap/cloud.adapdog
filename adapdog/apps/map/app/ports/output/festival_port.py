from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.domain.entities.festival_entity import Festival


class FestivalPort(ABC):
    """축제 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_festivals(self, region: Optional[str]) -> list[Festival]:
        """지역(선택)으로 축제 도메인 엔티티를 조회한다."""
        ...
