from __future__ import annotations

from pydantic import BaseModel

from map.app.dtos.audio_guide_dto import AudioGuideDto


class AudioGuideResponseSchema(BaseModel):
    """오디오 가이드 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    facility_id: int
    language: str
    script_text: str
    audio_url: str

    @classmethod
    def from_dto(cls, dto: AudioGuideDto) -> "AudioGuideResponseSchema":
        return cls(
            id=dto.id,
            facility_id=dto.facility_id,
            language=dto.language,
            script_text=dto.script_text,
            audio_url=dto.audio_url,
        )
