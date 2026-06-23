from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.domain.entities.vlog_entity import Vlog


class VlogPort(ABC):
    """브이로그 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_vlogs(self, pet_id: Optional[int]) -> list[Vlog]:
        """반려동물(선택)로 브이로그 도메인 엔티티를 조회한다(클립 포함)."""
        ...
