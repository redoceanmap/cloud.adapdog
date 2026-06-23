from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class YearSummary:
    """연말 결산 — 내 강아지(H5)의 한 해 여정 요약.

    한 해 동안의 이동거리·방문 장소 수와 자동 생성 스토리를 담는다.
    pet_id + year 조합은 유일하다(연도별 1건).
    """

    id: int
    pet_id: int
    year: int
    total_distance_km: float
    places_count: int
    story_text: str
    created_at: str  # ISO yyyy-mm-dd
