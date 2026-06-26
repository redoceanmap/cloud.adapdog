from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.inclusive_filter_schema import InclusiveFilterSchema
from map.app.dtos.inclusive_filter_dto import InclusiveFilterResponse
from map.app.ports.input.inclusive_filter_use_case import InclusiveFilterUseCase
from map.dependencies.inclusive_filter_provider import get_inclusive_filter_use_case

inclusive_filter_router = APIRouter(prefix="/inclusive-filter", tags=["inclusive-filter"])


@inclusive_filter_router.post("/search")
async def search_inclusive(
    schema: InclusiveFilterSchema,
    use_case: InclusiveFilterUseCase = Depends(get_inclusive_filter_use_case),
) -> InclusiveFilterResponse:
    return await use_case.find_inclusive(schema)


@inclusive_filter_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: InclusiveFilterUseCase = Depends(get_inclusive_filter_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
