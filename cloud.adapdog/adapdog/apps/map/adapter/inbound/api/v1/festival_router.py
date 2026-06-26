from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.festival_schema import FestivalResponseSchema
from map.app.ports.input.festival_use_case import FestivalUseCase
from map.dependencies.festival_provider import get_festival_use_case

festival_router = APIRouter(prefix="/festival", tags=["festival"])


@festival_router.get("")
async def list_festivals(
    region: Optional[str] = None,
    use_case: FestivalUseCase = Depends(get_festival_use_case),
) -> list[FestivalResponseSchema]:
    """E1/E2 축제 캘린더·리스트 — 지역(선택)으로 조회."""
    festivals = await use_case.list_festivals(region)
    return [FestivalResponseSchema.from_dto(f) for f in festivals]
