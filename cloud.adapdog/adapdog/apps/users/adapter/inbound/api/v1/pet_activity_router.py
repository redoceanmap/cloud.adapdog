from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from users.adapter.inbound.api.schemas.pet_activity_schema import (
    PetActivityRecordSchema,
    PetActivitySchema,
)
from users.app.ports.input.pet_activity_use_case import PetActivityUseCase
from users.dependencies.account_provider import get_current_account
from users.dependencies.pet_activity_provider import get_pet_activity_use_case
from users.domain.entities.account_entity import Account

pet_activity_router = APIRouter(prefix="/pet-activity", tags=["pet-activity"])


@pet_activity_router.post("")
async def record_activity(
    body: PetActivityRecordSchema,
    account: Account = Depends(get_current_account),
    use_case: PetActivityUseCase = Depends(get_pet_activity_use_case),
) -> PetActivitySchema:
    """반려동물의 시설 방문/저장 행동을 기록한다(인증 필요). 코호트 추천의 신호로 쌓인다."""
    activity = await use_case.record(
        pet_id=body.pet_id,
        facility_id=body.facility_id,
        action_type=body.action_type,
    )
    return PetActivitySchema.from_entity(activity)


@pet_activity_router.get("/pet/{pet_id}")
async def pet_activities(
    pet_id: int,
    account: Account = Depends(get_current_account),
    use_case: PetActivityUseCase = Depends(get_pet_activity_use_case),
) -> list[PetActivitySchema]:
    """특정 반려동물의 행동 기록 목록(인증 필요)."""
    items = await use_case.list_by_pet(pet_id)
    return [PetActivitySchema.from_entity(a) for a in items]


@pet_activity_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: PetActivityUseCase = Depends(get_pet_activity_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
