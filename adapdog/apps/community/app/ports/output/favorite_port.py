from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.domain.entities.favorite_entity import Favorite


class FavoritePort(ABC):
    """즐겨찾기 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_favorites(self, account_id: Optional[int]) -> list[Favorite]:
        """계정(선택)으로 즐겨찾기 도메인 엔티티를 조회한다."""
        ...
