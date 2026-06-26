from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.pet_place_schema import PetPlaceItemSchema
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.dependencies.pet_place_provider import get_pet_place_use_case

pet_place_router = APIRouter(prefix="/pet-place", tags=["pet-place"])


@pet_place_router.get("/search")
async def search_places(
    region: str,
    use_case: PetPlaceUseCase = Depends(get_pet_place_use_case),
) -> list[PetPlaceItemSchema]:
    places = await use_case.find_places(region)
    return [
        PetPlaceItemSchema(
            id=p.id,
            name=p.name,
            category=p.category,
            latitude=p.coordinate.latitude,
            longitude=p.coordinate.longitude,
            allowed_sizes=sorted(s.value for s in p.allowed_sizes),
        )
        for p in places
    ]


@pet_place_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: PetPlaceUseCase = Depends(get_pet_place_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
