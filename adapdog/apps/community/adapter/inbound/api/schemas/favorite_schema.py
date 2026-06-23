from __future__ import annotations

from pydantic import BaseModel

from community.app.dtos.favorite_dto import FavoriteDto


class FavoriteResponseSchema(BaseModel):
    """즐겨찾기 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    account_id: int
    facility_id: int
    facility_name: str
    created_at: str

    @classmethod
    def from_dto(cls, dto: FavoriteDto) -> "FavoriteResponseSchema":
        return cls(
            account_id=dto.account_id,
            facility_id=dto.facility_id,
            facility_name=dto.facility_name,
            created_at=dto.created_at,
        )
