from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class VlogClipDto:
    """브이로그 클립 응답 항목 (VlogDto에 중첩되는 종속 DTO)."""

    seq: int
    source_type: str
    media_url: str


@dataclass(frozen=True)
class VlogDto:
    """브이로그 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    itinerary_id: int
    tone: str
    video_url: str
    created_at: str
    clips: list[VlogClipDto] = field(default_factory=list)
