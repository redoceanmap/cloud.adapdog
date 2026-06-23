from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AudioGuideDto:
    """오디오 가이드 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    facility_id: int
    language: str
    script_text: str
    audio_url: str
