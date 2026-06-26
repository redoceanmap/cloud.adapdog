from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.domain.entities.stamp_spot_entity import StampSpot


class StampSpotPort(ABC):
    """스탬프 대상 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_spots(self, region: Optional[str]) -> list[StampSpot]:
        """지역(선택)으로 스탬프 대상 도메인 엔티티를 조회한다."""
        ...
