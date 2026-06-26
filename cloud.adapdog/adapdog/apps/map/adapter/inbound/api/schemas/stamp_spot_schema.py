from __future__ import annotations

from pydantic import BaseModel

from map.app.dtos.stamp_spot_dto import StampSpotDto


class StampSpotResponseSchema(BaseModel):
    """스탬프 대상 응답 스키마 (adapter 계층 — API 표현)."""

    id: int
    name: str
    region: str
    theme: str

    @classmethod
    def from_dto(cls, dto: StampSpotDto) -> "StampSpotResponseSchema":
        return cls(id=dto.id, name=dto.name, region=dto.region, theme=dto.theme)
