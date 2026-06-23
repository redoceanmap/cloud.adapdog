from __future__ import annotations

import logging
from typing import Optional

from trips.app.dtos.itinerary_dto import ItineraryDto, ItineraryStopDto
from trips.app.ports.input.itinerary_use_case import ItineraryUseCase
from trips.app.ports.output.itinerary_port import ItineraryPort

logger = logging.getLogger(__name__)


class ItineraryInteractor(ItineraryUseCase):
    """저장된 코스 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: ItineraryPort) -> None:
        self.repository = repository

    async def list_itineraries(self, pet_id: Optional[int] = None) -> list[ItineraryDto]:
        itineraries = await self.repository.find_itineraries(pet_id)
        logger.info("[ItineraryInteractor] list_itineraries | pet_id=%s → %d건", pet_id, len(itineraries))
        return [
            ItineraryDto(
                id=it.id,
                pet_id=it.pet_id,
                title=it.title,
                region=it.region,
                prompt_text=it.prompt_text,
                is_saved=it.is_saved,
                created_at=it.created_at,
                stops=[
                    ItineraryStopDto(
                        order=s.order,
                        name=s.name,
                        category=s.category,
                        latitude=s.latitude,
                        longitude=s.longitude,
                    )
                    for s in it.stops
                ],
            )
            for it in itineraries
        ]
