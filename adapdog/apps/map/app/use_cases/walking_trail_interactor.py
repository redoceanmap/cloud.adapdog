from __future__ import annotations

import logging
from typing import Optional

from map.app.dtos.walking_trail_dto import WalkingTrailDto
from map.app.ports.input.walking_trail_use_case import WalkingTrailUseCase
from map.app.ports.output.walking_trail_port import WalkingTrailPort

logger = logging.getLogger(__name__)


class WalkingTrailInteractor(WalkingTrailUseCase):
    """둘레길 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: WalkingTrailPort) -> None:
        self.repository = repository

    async def list_trails(self, region: Optional[str] = None) -> list[WalkingTrailDto]:
        trails = await self.repository.find_trails(region)
        logger.info("[WalkingTrailInteractor] list_trails | region=%s → %d건", region, len(trails))
        return [
            WalkingTrailDto(
                id=t.id, name=t.name, region=t.region, distance_km=t.distance_km,
                difficulty=t.difficulty, duration=t.duration, description=t.description,
                route_info=t.route_info,
            )
            for t in trails
        ]
