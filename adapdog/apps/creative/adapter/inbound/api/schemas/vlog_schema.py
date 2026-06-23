from __future__ import annotations

from pydantic import BaseModel

from creative.app.dtos.vlog_dto import VlogClipDto, VlogDto


class VlogClipResponseSchema(BaseModel):
    """브이로그 클립 응답 스키마 (VlogResponseSchema에 중첩)."""

    seq: int
    source_type: str
    media_url: str

    @classmethod
    def from_dto(cls, dto: VlogClipDto) -> "VlogClipResponseSchema":
        return cls(seq=dto.seq, source_type=dto.source_type, media_url=dto.media_url)


class VlogResponseSchema(BaseModel):
    """브이로그 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    itinerary_id: int
    tone: str
    video_url: str
    created_at: str
    clips: list[VlogClipResponseSchema]

    @classmethod
    def from_dto(cls, dto: VlogDto) -> "VlogResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            itinerary_id=dto.itinerary_id,
            tone=dto.tone,
            video_url=dto.video_url,
            created_at=dto.created_at,
            clips=[VlogClipResponseSchema.from_dto(c) for c in dto.clips],
        )
