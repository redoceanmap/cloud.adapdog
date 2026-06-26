from __future__ import annotations

import logging

from core.introduction import Introduction
from map.app.ports.input.visited_place_use_case import VisitedPlaceUseCase
from map.app.ports.output.visited_place_port import VisitedPlacePort
from map.domain.entities.visited_place_entity import VisitedPlace

logger = logging.getLogger(__name__)


class VisitedPlaceInteractor(VisitedPlaceUseCase):
    """발자국 조회 인터랙터. 집계 구현(DB read 모델)은 알지 못한다(DIP)."""

    def __init__(self, repository: VisitedPlacePort) -> None:
        self.repository = repository

    async def list_footprint(self, pet_id: int, limit: int = 50) -> list[VisitedPlace]:
        results = await self.repository.list_visited(pet_id, limit)
        logger.info(
            "[VisitedPlaceInteractor] list_footprint | pet_id=%s → %d곳", pet_id, len(results)
        )
        return results

    async def introduce_myself(self) -> Introduction:
        intro = await self.repository.introduce_myself()
        intro.trail.append("interactor")
        return intro
