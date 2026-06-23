from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class YearSummaryDto:
    """연말 결산 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    year: int
    total_distance_km: float
    places_count: int
    story_text: str
    created_at: str
