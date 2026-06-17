from __future__ import annotations

from fastapi import APIRouter, Depends

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
