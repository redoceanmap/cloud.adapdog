from __future__ import annotations

import logging
from typing import Optional

from trips.app.dtos.itinerary_dto import ItineraryDto, ItineraryStopDto, SaveItineraryInput
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

    async def save_itinerary(self, data: SaveItineraryInput) -> ItineraryDto:
        saved = await self.repository.save_itinerary(data)
        logger.info(
            "[ItineraryInteractor] save_itinerary | pet_id=%s region=%s stops=%d",
            data.pet_id,
            data.region,
            len(data.stops),
        )
        return self._to_dto(saved)

    async def update_itinerary(self, itinerary_id: int, data: SaveItineraryInput) -> ItineraryDto | None:
        saved = await self.repository.update_itinerary(itinerary_id, data)
        if saved is None:
            logger.warning("[ItineraryInteractor] update_itinerary | id=%s not found", itinerary_id)
            return None
        logger.info(
            "[ItineraryInteractor] update_itinerary | id=%s pet_id=%s stops=%d",
            itinerary_id,
            data.pet_id,
            len(data.stops),
        )
        return self._to_dto(saved)

    async def delete_itinerary(self, itinerary_id: int) -> bool:
        ok = await self.repository.delete_itinerary(itinerary_id)
        logger.info("[ItineraryInteractor] delete_itinerary | id=%s ok=%s", itinerary_id, ok)
        return ok

    @staticmethod
    def _to_dto(saved) -> ItineraryDto:
        return ItineraryDto(
            id=saved.id,
            pet_id=saved.pet_id,
            title=saved.title,
            region=saved.region,
            prompt_text=saved.prompt_text,
            is_saved=saved.is_saved,
            created_at=saved.created_at,
            stops=[
                ItineraryStopDto(
                    order=s.order,
                    name=s.name,
                    category=s.category,
                    latitude=s.latitude,
                    longitude=s.longitude,
                )
                for s in saved.stops
            ],
        )
