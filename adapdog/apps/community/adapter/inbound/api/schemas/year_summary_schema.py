from __future__ import annotations

from pydantic import BaseModel

from community.app.dtos.year_summary_dto import YearSummaryDto


class YearSummaryResponseSchema(BaseModel):
    """연말 결산 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    year: int
    total_distance_km: float
    places_count: int
    story_text: str
    created_at: str

    @classmethod
    def from_dto(cls, dto: YearSummaryDto) -> "YearSummaryResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            year=dto.year,
            total_distance_km=dto.total_distance_km,
            places_count=dto.places_count,
            story_text=dto.story_text,
            created_at=dto.created_at,
        )
