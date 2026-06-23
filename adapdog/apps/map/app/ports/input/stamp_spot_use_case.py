from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.app.dtos.stamp_spot_dto import StampSpotDto


class StampSpotUseCase(ABC):
    """문화시설 스탬프 대상 조회 입력 포트."""

    @abstractmethod
    async def list_spots(self, region: Optional[str] = None) -> list[StampSpotDto]:
        """지역(선택)으로 스탬프 대상을 조회한다. region이 없으면 전체."""
        ...
