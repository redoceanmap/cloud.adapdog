from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.visited_place_schema import VisitedPlaceSchema
from map.app.ports.input.visited_place_use_case import VisitedPlaceUseCase
from map.dependencies.visited_place_provider import get_visited_place_use_case

visited_place_router = APIRouter(prefix="/visited-place", tags=["visited-place"])


@visited_place_router.get("")
async def list_footprint(
    pet_id: int = Query(..., description="반려동물 ID"),
    limit: int = Query(50, ge=1, le=200, description="최대 시설 수"),
    use_case: VisitedPlaceUseCase = Depends(get_visited_place_use_case),
) -> list[VisitedPlaceSchema]:
    """반려동물이 실제로 다녀온 시설(발자국)을 첫 방문 순으로 반환한다."""
    results = await use_case.list_footprint(pet_id, limit)
    return [VisitedPlaceSchema.from_entity(v) for v in results]


@visited_place_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: VisitedPlaceUseCase = Depends(get_visited_place_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
