from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.app.dtos.festival_dto import FestivalDto


class FestivalUseCase(ABC):
    """지역 축제 조회 입력 포트."""

    @abstractmethod
    async def list_festivals(self, region: Optional[str] = None) -> list[FestivalDto]:
        """지역(선택)으로 축제를 조회한다. region이 없으면 전체."""
        ...
