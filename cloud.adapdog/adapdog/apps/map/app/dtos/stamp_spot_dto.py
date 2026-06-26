from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class StampSpotDto:
    """스탬프 대상 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    name: str
    region: str
    theme: str
