from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from trips.adapter.inbound.api.schemas.itinerary_schema import ItineraryResponseSchema
from trips.app.ports.input.itinerary_use_case import ItineraryUseCase
from trips.dependencies.itinerary_provider import get_itinerary_use_case

itinerary_router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@itinerary_router.get("")
async def list_itineraries(
    pet_id: Optional[int] = None,
    use_case: ItineraryUseCase = Depends(get_itinerary_use_case),
) -> list[ItineraryResponseSchema]:
    """C(코스저장) 저장된 추천 코스 — 반려동물(선택)로 조회."""
    itineraries = await use_case.list_itineraries(pet_id)
    return [ItineraryResponseSchema.from_dto(it) for it in itineraries]
