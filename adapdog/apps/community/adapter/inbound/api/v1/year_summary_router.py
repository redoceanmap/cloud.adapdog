from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from community.adapter.inbound.api.schemas.year_summary_schema import YearSummaryResponseSchema
from community.app.ports.input.year_summary_use_case import YearSummaryUseCase
from community.dependencies.year_summary_provider import get_year_summary_use_case

year_summary_router = APIRouter(prefix="/year-summary", tags=["year-summary"])


@year_summary_router.get("")
async def get_summary(
    pet_id: Optional[int] = None,
    use_case: YearSummaryUseCase = Depends(get_year_summary_use_case),
) -> list[YearSummaryResponseSchema]:
    """H5 연말 결산 — 반려동물(선택)로 조회."""
    summaries = await use_case.get_summary(pet_id)
    return [YearSummaryResponseSchema.from_dto(s) for s in summaries]
