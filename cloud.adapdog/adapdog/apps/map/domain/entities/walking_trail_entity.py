from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class WalkingTrail:
    """걷기 좋은 둘레길 — 둘러보기(E3)의 한 코스.

    원천: 두루누비(전국길관광정보표준데이터, 현재 mock). path_geojson(경로 좌표)은
    과정규화 회피 위해 단일 값으로 보관하나, mock 단계에선 생략한다.
    """

    id: int
    name: str
    region: str
    distance_km: float
    difficulty: str
    duration: str
    description: str
    route_info: str = ""  # "A→B→C" 형식의 경유지 텍스트. 없으면 빈 문자열.
