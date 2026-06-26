from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.walking_trail_schema import WalkingTrailResponseSchema
from map.app.ports.input.walking_trail_use_case import WalkingTrailUseCase
from map.dependencies.walking_trail_provider import get_walking_trail_use_case

walking_trail_router = APIRouter(prefix="/walking-trail", tags=["walking-trail"])


@walking_trail_router.get("")
async def list_trails(
    region: Optional[str] = None,
    use_case: WalkingTrailUseCase = Depends(get_walking_trail_use_case),
) -> list[WalkingTrailResponseSchema]:
    """E3 걷기 코스(둘레길) — 지역(선택)으로 조회."""
    trails = await use_case.list_trails(region)
    return [WalkingTrailResponseSchema.from_dto(t) for t in trails]
