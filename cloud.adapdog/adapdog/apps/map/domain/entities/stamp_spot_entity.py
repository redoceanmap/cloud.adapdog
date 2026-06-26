from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class StampSpot:
    """문화시설 스탬프 대상 — 둘러보기(E4) 스탬프 컬렉션의 한 지점.

    원천: 지역문화통합정보시스템(현재 mock). region은 시군구, theme는 스탬프 테마.
    """

    id: int
    name: str
    region: str
    theme: str
