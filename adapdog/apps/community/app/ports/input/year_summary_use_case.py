from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.app.dtos.year_summary_dto import YearSummaryDto


class YearSummaryUseCase(ABC):
    """연말 결산 조회 입력 포트."""

    @abstractmethod
    async def get_summary(self, pet_id: Optional[int] = None) -> list[YearSummaryDto]:
        """반려동물(선택)로 연말 결산을 조회한다. pet_id가 없으면 전체."""
        ...
