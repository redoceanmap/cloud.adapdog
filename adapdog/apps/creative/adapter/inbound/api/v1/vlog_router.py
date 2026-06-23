from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from creative.adapter.inbound.api.schemas.vlog_schema import VlogResponseSchema
from creative.app.ports.input.vlog_use_case import VlogUseCase
from creative.dependencies.vlog_provider import get_vlog_use_case

vlog_router = APIRouter(prefix="/vlog", tags=["vlog"])


@vlog_router.get("")
async def list_vlogs(
    pet_id: Optional[int] = None,
    use_case: VlogUseCase = Depends(get_vlog_use_case),
) -> list[VlogResponseSchema]:
    """G 강아지 시점 브이로그 — 반려동물(선택)로 조회(클립 포함)."""
    vlogs = await use_case.list_vlogs(pet_id)
    return [VlogResponseSchema.from_dto(v) for v in vlogs]
