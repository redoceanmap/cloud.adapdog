from __future__ import annotations

from typing import Optional

from community.app.ports.output.favorite_port import FavoritePort
from community.domain.entities.favorite_entity import Favorite


class MockFavoriteRepository(FavoritePort):
    """데이터 없는 단계의 mock 즐겨찾기 — 전주 데모 시나리오용.

    DB 시드로 전환 시 DbFavoriteRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        Favorite(101, 201, "한옥마을 펫카페", "2026-06-08"),
        Favorite(101, 202, "덕진공원", "2026-06-09"),
        Favorite(101, 203, "그늘 산책로", "2026-06-11"),
    )

    async def find_favorites(self, account_id: Optional[int]) -> list[Favorite]:
        if account_id is not None:
            return [f for f in self._DATA if f.account_id == account_id]
        return list(self._DATA)
