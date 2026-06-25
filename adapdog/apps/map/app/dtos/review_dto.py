from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ReviewDto:
    """후기 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    facility_id: int
    place_name: str
    title: str
    body: str
    rating: float
    author: str
    source: str
