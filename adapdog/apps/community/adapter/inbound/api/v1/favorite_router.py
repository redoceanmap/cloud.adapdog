from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from community.adapter.inbound.api.schemas.favorite_schema import FavoriteResponseSchema
from community.app.ports.input.favorite_use_case import FavoriteUseCase
from community.dependencies.favorite_provider import get_favorite_use_case

favorite_router = APIRouter(prefix="/favorite", tags=["favorite"])


@favorite_router.get("")
async def list_favorites(
    account_id: Optional[int] = None,
    use_case: FavoriteUseCase = Depends(get_favorite_use_case),
) -> list[FavoriteResponseSchema]:
    """즐겨찾기 — 계정(선택)으로 조회."""
    favorites = await use_case.list_favorites(account_id)
    return [FavoriteResponseSchema.from_dto(f) for f in favorites]
