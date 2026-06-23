from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from trips.adapter.inbound.api.schemas.reservation_schema import ReservationResponseSchema
from trips.app.ports.input.reservation_use_case import ReservationUseCase
from trips.dependencies.reservation_provider import get_reservation_use_case

reservation_router = APIRouter(prefix="/reservation", tags=["reservation"])


@reservation_router.get("")
async def list_reservations(
    pet_id: Optional[int] = None,
    use_case: ReservationUseCase = Depends(get_reservation_use_case),
) -> list[ReservationResponseSchema]:
    """C10/C11(식당·숙소 예약) 목록 — 반려동물(선택)로 조회."""
    reservations = await use_case.list_reservations(pet_id)
    return [ReservationResponseSchema.from_dto(r) for r in reservations]
