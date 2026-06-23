from __future__ import annotations

from pydantic import BaseModel

from community.app.dtos.community_post_dto import CommunityPostDto


class CommunityPostResponseSchema(BaseModel):
    """코스 후기 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    account_id: int
    pet_id: int
    itinerary_id: int
    title: str
    body: str
    created_at: str
    like_count: int

    @classmethod
    def from_dto(cls, dto: CommunityPostDto) -> "CommunityPostResponseSchema":
        return cls(
            id=dto.id,
            account_id=dto.account_id,
            pet_id=dto.pet_id,
            itinerary_id=dto.itinerary_id,
            title=dto.title,
            body=dto.body,
            created_at=dto.created_at,
            like_count=dto.like_count,
        )
