from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from trips.adapter.inbound.api.schemas.itinerary_schema import (
    ItineraryCreateSchema,
    ItineraryResponseSchema,
)
from trips.app.dtos.itinerary_dto import ItineraryStopInput, SaveItineraryInput
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


@itinerary_router.post("", status_code=201)
async def save_itinerary(
    body: ItineraryCreateSchema,
    use_case: ItineraryUseCase = Depends(get_itinerary_use_case),
) -> ItineraryResponseSchema:
    """채팅으로 만든 코스를 저장한다."""
    if not body.stops:
        raise HTTPException(status_code=400, detail="저장할 장소가 없습니다.")
    saved = await use_case.save_itinerary(
        SaveItineraryInput(
            pet_id=body.pet_id,
            title=body.title,
            region=body.region,
            prompt_text=body.prompt_text,
            stops=[
                ItineraryStopInput(
                    order=s.order,
                    name=s.name,
                    category=s.category,
                    latitude=s.latitude,
                    longitude=s.longitude,
                )
                for s in body.stops
            ],
        ),
    )
    return ItineraryResponseSchema.from_dto(saved)


@itinerary_router.put("/{itinerary_id}")
async def update_itinerary(
    itinerary_id: int,
    body: ItineraryCreateSchema,
    use_case: ItineraryUseCase = Depends(get_itinerary_use_case),
) -> ItineraryResponseSchema:
    """저장된 코스를 갱신한다."""
    if not body.stops:
        raise HTTPException(status_code=400, detail="저장할 장소가 없습니다.")
    updated = await use_case.update_itinerary(
        itinerary_id,
        SaveItineraryInput(
            pet_id=body.pet_id,
            title=body.title,
            region=body.region,
            prompt_text=body.prompt_text,
            stops=[
                ItineraryStopInput(
                    order=s.order,
                    name=s.name,
                    category=s.category,
                    latitude=s.latitude,
                    longitude=s.longitude,
                )
                for s in body.stops
            ],
        ),
    )
    if updated is None:
        raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다.")
    return ItineraryResponseSchema.from_dto(updated)


@itinerary_router.delete("/{itinerary_id}", status_code=204)
async def delete_itinerary(
    itinerary_id: int,
    use_case: ItineraryUseCase = Depends(get_itinerary_use_case),
) -> None:
    """저장된 코스를 삭제한다."""
    if not await use_case.delete_itinerary(itinerary_id):
        raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다.")
