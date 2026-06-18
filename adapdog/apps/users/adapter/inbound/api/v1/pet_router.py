from __future__ import annotations

from fastapi import APIRouter, Depends

from users.adapter.inbound.api.schemas.pet_schema import PetRegisterSchema, PetSchema
from users.app.ports.input.pet_use_case import PetUseCase
from users.dependencies.account_provider import get_current_account
from users.dependencies.pet_provider import get_pet_use_case
from users.domain.entities.account_entity import Account

pet_router = APIRouter(prefix="/pet", tags=["pet"])


@pet_router.post("")
async def register_pet(
    body: PetRegisterSchema,
    account: Account = Depends(get_current_account),
    use_case: PetUseCase = Depends(get_pet_use_case),
) -> PetSchema:
    """반려동물 추가 등록(인증 필요). 견종으로 크기·체질·기질이 자동완성된다."""
    pet = await use_case.register(
        account_id=account.id,
        name=body.name,
        breed=body.breed,
        photo_url=body.photo_url,
        birth_year=body.birth_year,
        gender=body.gender,
        features=body.features,
    )
    return PetSchema.from_entity(pet)


@pet_router.get("/me")
async def my_pets(
    account: Account = Depends(get_current_account),
    use_case: PetUseCase = Depends(get_pet_use_case),
) -> list[PetSchema]:
    """내 반려동물 목록(인증 필요)."""
    pets = await use_case.list_by_account(account.id)
    return [PetSchema.from_entity(p) for p in pets]
