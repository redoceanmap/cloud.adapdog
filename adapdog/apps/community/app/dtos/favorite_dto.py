from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class FavoriteDto:
    """즐겨찾기 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    account_id: int
    facility_id: int
    facility_name: str
    created_at: str
