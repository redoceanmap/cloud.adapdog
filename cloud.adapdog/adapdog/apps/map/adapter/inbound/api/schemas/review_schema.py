from __future__ import annotations

from pydantic import BaseModel

from map.app.dtos.review_dto import ReviewDto


class ReviewResponseSchema(BaseModel):
    """후기 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    facility_id: int
    place_name: str
    title: str
    body: str
    rating: float
    author: str
    source: str

    @classmethod
    def from_dto(cls, dto: ReviewDto) -> "ReviewResponseSchema":
        return cls(
            id=dto.id,
            facility_id=dto.facility_id,
            place_name=dto.place_name,
            title=dto.title,
            body=dto.body,
            rating=dto.rating,
            author=dto.author,
            source=dto.source,
        )
