from __future__ import annotations

import logging

from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.pet_place_port import PetFriendlyPlacePort
from map.domain.entities.pet_place_entity import PetFriendlyPlace

logger = logging.getLogger(__name__)


class PetPlaceInteractor(PetPlaceUseCase):
    """반려동물 동반시설 조회 인터랙터 — 출력 포트(데이터원)에 위임."""

    def __init__(self, repository: PetFriendlyPlacePort) -> None:
        self.repository = repository

    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        places = await self.repository.find_places(region)
        logger.info("[PetPlaceInteractor] find_places | region=%s count=%d", region, len(places))
        return places
