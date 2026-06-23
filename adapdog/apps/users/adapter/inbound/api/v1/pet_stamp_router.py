from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from users.adapter.inbound.api.schemas.pet_stamp_schema import PetStampResponseSchema
from users.app.ports.input.pet_stamp_use_case import PetStampUseCase
from users.dependencies.pet_stamp_provider import get_pet_stamp_use_case

pet_stamp_router = APIRouter(prefix="/pet-stamp", tags=["pet_stamp"])


@pet_stamp_router.get("")
async def list_stamps(
    pet_id: Optional[int] = None,
    use_case: PetStampUseCase = Depends(get_pet_stamp_use_case),
) -> list[PetStampResponseSchema]:
    """E4 수집 스탬프 — 반려동물(선택)로 모은 스탬프를 조회."""
    stamps = await use_case.list_stamps(pet_id)
    return [PetStampResponseSchema.from_dto(s) for s in stamps]
