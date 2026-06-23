from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Review:
    """리뷰 — 계정이 시설에 남긴 평가(ERD 예정).

    facility_name은 표시 편의를 위한 비정규화 필드. rating은 1~5.
    """

    id: int
    account_id: int
    facility_id: int
    facility_name: str
    rating: int
    comment: str
    created_at: str  # ISO yyyy-mm-dd
