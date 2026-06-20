from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.entry_verdict_schema import EntryVerdictSchema
from map.app.dtos.entry_verdict_dto import EntryVerdictResponse
from map.app.ports.input.entry_verdict_use_case import EntryVerdictUseCase
from map.dependencies.entry_verdict_provider import get_entry_verdict_use_case

entry_verdict_router = APIRouter(prefix="/entry-verdict", tags=["entry-verdict"])


@entry_verdict_router.post("/check")
async def check_entry(
    schema: EntryVerdictSchema,
    use_case: EntryVerdictUseCase = Depends(get_entry_verdict_use_case),
) -> EntryVerdictResponse:
    return await use_case.check(schema)


@entry_verdict_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: EntryVerdictUseCase = Depends(get_entry_verdict_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
