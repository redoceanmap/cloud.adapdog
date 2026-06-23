from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from users.adapter.inbound.api.schemas.pet_persona_schema import PetPersonaResponseSchema
from users.app.ports.input.pet_persona_use_case import PetPersonaUseCase
from users.dependencies.pet_persona_provider import get_pet_persona_use_case

pet_persona_router = APIRouter(prefix="/pet-persona", tags=["pet_persona"])


@pet_persona_router.get("")
async def get_persona(
    pet_id: int,
    use_case: PetPersonaUseCase = Depends(get_pet_persona_use_case),
) -> PetPersonaResponseSchema:
    """B 페르소나 — 반려동물의 페르소나를 조회(1:1). 없으면 404."""
    persona = await use_case.get_persona(pet_id)
    if persona is None:
        raise HTTPException(status_code=404, detail="페르소나가 없습니다.")
    return PetPersonaResponseSchema.from_dto(persona)
