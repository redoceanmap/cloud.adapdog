from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.review_schema import ReviewResponseSchema
from map.app.ports.input.review_use_case import ReviewUseCase
from map.dependencies.review_provider import get_review_use_case

review_router = APIRouter(prefix="/review", tags=["review"])


@review_router.get("")
async def list_reviews(
    facility_id: Optional[int] = None,
    place_name: Optional[str] = None,
    use_case: ReviewUseCase = Depends(get_review_use_case),
) -> list[ReviewResponseSchema]:
    """시설상세 '후기' 탭 — 시설(id 또는 이름)로 보호자 후기를 조회."""
    reviews = await use_case.list_reviews(facility_id, place_name)
    return [ReviewResponseSchema.from_dto(r) for r in reviews]
