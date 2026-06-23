from __future__ import annotations

import logging
from typing import Optional

from trips.app.dtos.reservation_dto import ReservationDto
from trips.app.ports.input.reservation_use_case import ReservationUseCase
from trips.app.ports.output.reservation_port import ReservationPort

logger = logging.getLogger(__name__)


class ReservationInteractor(ReservationUseCase):
    """예약 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: ReservationPort) -> None:
        self.repository = repository

    async def list_reservations(self, pet_id: Optional[int] = None) -> list[ReservationDto]:
        reservations = await self.repository.find_reservations(pet_id)
        logger.info("[ReservationInteractor] list_reservations | pet_id=%s → %d건", pet_id, len(reservations))
        return [
            ReservationDto(
                id=r.id,
                itinerary_id=r.itinerary_id,
                pet_id=r.pet_id,
                type=r.type,
                place_name=r.place_name,
                party_size=r.party_size,
                price=r.price,
                status=r.status,
                reserved_at=r.reserved_at,
            )
            for r in reservations
        ]
