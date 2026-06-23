from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.domain.entities.year_summary_entity import YearSummary


class YearSummaryPort(ABC):
    """연말 결산 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_summaries(self, pet_id: Optional[int]) -> list[YearSummary]:
        """반려동물(선택)로 연말 결산 도메인 엔티티를 조회한다."""
        ...
