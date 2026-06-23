from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class FestivalDto:
    """축제 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    name: str
    region: str
    start_date: str
    end_date: str
    pet_allowed: bool
    source: str
