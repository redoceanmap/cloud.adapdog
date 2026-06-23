from __future__ import annotations

import logging
from typing import Optional

from community.app.dtos.favorite_dto import FavoriteDto
from community.app.ports.input.favorite_use_case import FavoriteUseCase
from community.app.ports.output.favorite_port import FavoritePort

logger = logging.getLogger(__name__)


class FavoriteInteractor(FavoriteUseCase):
    """즐겨찾기 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: FavoritePort) -> None:
        self.repository = repository

    async def list_favorites(self, account_id: Optional[int] = None) -> list[FavoriteDto]:
        favorites = await self.repository.find_favorites(account_id)
        logger.info("[FavoriteInteractor] list_favorites | account_id=%s → %d건", account_id, len(favorites))
        return [
            FavoriteDto(
                account_id=f.account_id, facility_id=f.facility_id,
                facility_name=f.facility_name, created_at=f.created_at,
            )
            for f in favorites
        ]
