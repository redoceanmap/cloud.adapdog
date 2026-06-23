from __future__ import annotations

import logging
from typing import Optional

from map.app.dtos.festival_dto import FestivalDto
from map.app.ports.input.festival_use_case import FestivalUseCase
from map.app.ports.output.festival_port import FestivalPort

logger = logging.getLogger(__name__)


class FestivalInteractor(FestivalUseCase):
    """지역 축제 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: FestivalPort) -> None:
        self.repository = repository

    async def list_festivals(self, region: Optional[str] = None) -> list[FestivalDto]:
        festivals = await self.repository.find_festivals(region)
        logger.info("[FestivalInteractor] list_festivals | region=%s → %d건", region, len(festivals))
        return [
            FestivalDto(
                id=f.id, name=f.name, region=f.region,
                start_date=f.start_date, end_date=f.end_date,
                pet_allowed=f.pet_allowed, source=f.source,
            )
            for f in festivals
        ]
