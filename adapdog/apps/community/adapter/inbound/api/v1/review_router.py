from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from community.adapter.inbound.api.schemas.review_schema import ReviewResponseSchema
from community.app.ports.input.review_use_case import ReviewUseCase
from community.dependencies.review_provider import get_review_use_case

review_router = APIRouter(prefix="/review", tags=["review"])


@review_router.get("")
async def list_reviews(
    facility_id: Optional[int] = None,
    use_case: ReviewUseCase = Depends(get_review_use_case),
) -> list[ReviewResponseSchema]:
    """리뷰 — 시설(선택)로 조회."""
    reviews = await use_case.list_reviews(facility_id)
    return [ReviewResponseSchema.from_dto(r) for r in reviews]
