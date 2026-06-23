from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Favorite:
    """즐겨찾기 — 계정이 찜한 시설(ERD 예정).

    account_id + facility_id 조합이 식별자(별도 id 없음).
    facility_name은 표시 편의를 위한 비정규화 필드.
    """

    account_id: int
    facility_id: int
    facility_name: str
    created_at: str  # ISO yyyy-mm-dd
