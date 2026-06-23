from __future__ import annotations

from typing import Optional

from map.app.ports.output.festival_port import FestivalPort
from map.domain.entities.festival_entity import Festival

_SOURCE = "지역축제·문화행사 데이터(mock)"


class MockFestivalRepository(FestivalPort):
    """데이터 없는 단계의 mock 축제 — 전주 데모 시나리오용.

    공공데이터(지역축제·문화행사) 연동 전까지 사용. DB 시드로 전환 시
    DbFestivalRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        Festival(1, "전주한옥마을 단풍축제", "전주", "2026-10-24", "2026-11-09", True, _SOURCE),
        Festival(2, "전주비빔밥축제", "전주", "2026-10-08", "2026-10-11", True, _SOURCE),
        Festival(3, "전주대사습놀이 전국대회", "전주", "2026-06-05", "2026-06-07", True, _SOURCE),
        Festival(4, "전주야행", "전주", "2026-09-04", "2026-09-06", True, _SOURCE),
        Festival(5, "전주국제영화제", "전주", "2026-04-30", "2026-05-09", False, _SOURCE),
    )

    async def find_festivals(self, region: Optional[str]) -> list[Festival]:
        if region:
            return [f for f in self._DATA if region in f.region]
        return list(self._DATA)
