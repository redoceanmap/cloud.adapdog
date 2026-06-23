from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Festival:
    """지역 축제 — 둘러보기(E1/E2) 캘린더의 한 항목.

    원천: 지역축제·문화행사 공공데이터(현재는 mock). region은 시작지점 시군구.
    """

    id: int
    name: str
    region: str
    start_date: str  # ISO yyyy-mm-dd
    end_date: str
    pet_allowed: bool
    source: str
