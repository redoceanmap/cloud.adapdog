from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from creative.adapter.inbound.api.schemas.decoration_schema import DecorationResponseSchema
from creative.app.ports.input.decoration_use_case import DecorationUseCase
from creative.dependencies.decoration_provider import get_decoration_use_case

decoration_router = APIRouter(prefix="/decoration", tags=["decoration"])


@decoration_router.get("")
async def list_decorations(
    pet_id: Optional[int] = None,
    use_case: DecorationUseCase = Depends(get_decoration_use_case),
) -> list[DecorationResponseSchema]:
    """F3/F8 꾸미기 결과 — 반려동물(선택)로 조회."""
    decorations = await use_case.list_decorations(pet_id)
    return [DecorationResponseSchema.from_dto(d) for d in decorations]
