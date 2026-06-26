from __future__ import annotations

from pydantic import BaseModel

from map.app.dtos.festival_dto import FestivalDto


class FestivalResponseSchema(BaseModel):
    """축제 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    name: str
    region: str
    start_date: str
    end_date: str
    pet_allowed: bool
    source: str

    @classmethod
    def from_dto(cls, dto: FestivalDto) -> "FestivalResponseSchema":
        return cls(
            id=dto.id,
            name=dto.name,
            region=dto.region,
            start_date=dto.start_date,
            end_date=dto.end_date,
            pet_allowed=dto.pet_allowed,
            source=dto.source,
        )
