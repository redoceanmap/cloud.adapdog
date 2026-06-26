from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.app.dtos.walking_trail_dto import WalkingTrailDto


class WalkingTrailUseCase(ABC):
    """둘레길 조회 입력 포트."""

    @abstractmethod
    async def list_trails(self, region: Optional[str] = None) -> list[WalkingTrailDto]:
        """지역(선택)으로 둘레길을 조회한다. region이 없으면 전체."""
        ...
