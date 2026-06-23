from __future__ import annotations

from typing import Optional

from map.app.ports.output.stamp_spot_port import StampSpotPort
from map.domain.entities.stamp_spot_entity import StampSpot


class MockStampSpotRepository(StampSpotPort):
    """데이터 없는 단계의 mock 스탬프 대상 — 전주 문화시설 데모.

    지역문화통합정보시스템 연동 전까지 사용. DbStampSpotRepository로 교체 시
    도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        StampSpot(1, "경기전", "전주", "조선 왕조의 뿌리"),
        StampSpot(2, "전동성당", "전주", "근대 건축 산책"),
        StampSpot(3, "전주향교", "전주", "은행나무 고즈넉길"),
        StampSpot(4, "오목대", "전주", "한옥마을 전망"),
        StampSpot(5, "전주한벽문화관", "전주", "전통 공예 체험"),
        StampSpot(6, "국립무형유산원", "전주", "무형유산 테마"),
    )

    async def find_spots(self, region: Optional[str]) -> list[StampSpot]:
        if region:
            return [s for s in self._DATA if region in s.region]
        return list(self._DATA)
