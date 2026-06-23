from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ReviewDto:
    """리뷰 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    account_id: int
    facility_id: int
    facility_name: str
    rating: int
    comment: str
    created_at: str
