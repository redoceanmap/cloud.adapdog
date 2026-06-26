from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PetStampDto:
    """수집 스탬프 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    pet_id: int
    stamp_spot_id: int
    spot_name: str
    collected_at: str
