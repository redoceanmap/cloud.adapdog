from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.stamp_spot_schema import StampSpotResponseSchema
from map.app.ports.input.stamp_spot_use_case import StampSpotUseCase
from map.dependencies.stamp_spot_provider import get_stamp_spot_use_case

stamp_spot_router = APIRouter(prefix="/stamp-spot", tags=["stamp-spot"])


@stamp_spot_router.get("")
async def list_spots(
    region: Optional[str] = None,
    use_case: StampSpotUseCase = Depends(get_stamp_spot_use_case),
) -> list[StampSpotResponseSchema]:
    """E4 문화시설 스탬프 컬렉션 — 지역(선택)으로 조회."""
    spots = await use_case.list_spots(region)
    return [StampSpotResponseSchema.from_dto(s) for s in spots]
