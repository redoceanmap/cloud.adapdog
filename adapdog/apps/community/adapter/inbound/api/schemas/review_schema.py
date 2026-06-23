from __future__ import annotations

from pydantic import BaseModel

from community.app.dtos.review_dto import ReviewDto


class ReviewResponseSchema(BaseModel):
    """리뷰 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    account_id: int
    facility_id: int
    facility_name: str
    rating: int
    comment: str
    created_at: str

    @classmethod
    def from_dto(cls, dto: ReviewDto) -> "ReviewResponseSchema":
        return cls(
            id=dto.id,
            account_id=dto.account_id,
            facility_id=dto.facility_id,
            facility_name=dto.facility_name,
            rating=dto.rating,
            comment=dto.comment,
            created_at=dto.created_at,
        )
