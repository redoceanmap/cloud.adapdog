from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.app.dtos.favorite_dto import FavoriteDto


class FavoriteUseCase(ABC):
    """즐겨찾기 조회 입력 포트."""

    @abstractmethod
    async def list_favorites(self, account_id: Optional[int] = None) -> list[FavoriteDto]:
        """계정(선택)으로 즐겨찾기를 조회한다. account_id가 없으면 전체."""
        ...
