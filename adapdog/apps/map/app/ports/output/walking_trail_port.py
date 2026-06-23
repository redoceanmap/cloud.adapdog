from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.domain.entities.walking_trail_entity import WalkingTrail


class WalkingTrailPort(ABC):
    """둘레길 데이터 조회 출력 포트. 구현체(mock/CSV/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_trails(self, region: Optional[str]) -> list[WalkingTrail]:
        """지역(선택)으로 둘레길 도메인 엔티티를 조회한다."""
        ...
