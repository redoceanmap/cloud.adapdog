from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.policy_card_schema import PolicyCardSchema
from map.app.dtos.policy_card_dto import PolicyCardResponse
from map.app.ports.input.policy_card_use_case import PolicyCardUseCase
from map.dependencies.policy_card_provider import get_policy_card_use_case

policy_card_router = APIRouter(prefix="/policy-card", tags=["policy-card"])


@policy_card_router.post("/parse")
async def parse_policy(
    schema: PolicyCardSchema,
    use_case: PolicyCardUseCase = Depends(get_policy_card_use_case),
) -> PolicyCardResponse:
    return await use_case.parse_policy(schema)


@policy_card_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: PolicyCardUseCase = Depends(get_policy_card_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
