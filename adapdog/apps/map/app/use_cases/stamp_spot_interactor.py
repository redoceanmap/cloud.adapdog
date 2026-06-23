from __future__ import annotations

import logging
from typing import Optional

from map.app.dtos.stamp_spot_dto import StampSpotDto
from map.app.ports.input.stamp_spot_use_case import StampSpotUseCase
from map.app.ports.output.stamp_spot_port import StampSpotPort

logger = logging.getLogger(__name__)


class StampSpotInteractor(StampSpotUseCase):
    """스탬프 대상 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: StampSpotPort) -> None:
        self.repository = repository

    async def list_spots(self, region: Optional[str] = None) -> list[StampSpotDto]:
        spots = await self.repository.find_spots(region)
        logger.info("[StampSpotInteractor] list_spots | region=%s → %d건", region, len(spots))
        return [
            StampSpotDto(id=s.id, name=s.name, region=s.region, theme=s.theme)
            for s in spots
        ]
