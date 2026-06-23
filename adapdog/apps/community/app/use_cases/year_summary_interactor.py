from __future__ import annotations

import logging
from typing import Optional

from community.app.dtos.year_summary_dto import YearSummaryDto
from community.app.ports.input.year_summary_use_case import YearSummaryUseCase
from community.app.ports.output.year_summary_port import YearSummaryPort

logger = logging.getLogger(__name__)


class YearSummaryInteractor(YearSummaryUseCase):
    """연말 결산 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: YearSummaryPort) -> None:
        self.repository = repository

    async def get_summary(self, pet_id: Optional[int] = None) -> list[YearSummaryDto]:
        summaries = await self.repository.find_summaries(pet_id)
        logger.info("[YearSummaryInteractor] get_summary | pet_id=%s → %d건", pet_id, len(summaries))
        return [
            YearSummaryDto(
                id=s.id, pet_id=s.pet_id, year=s.year,
                total_distance_km=s.total_distance_km, places_count=s.places_count,
                story_text=s.story_text, created_at=s.created_at,
            )
            for s in summaries
        ]
