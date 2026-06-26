from __future__ import annotations

from pydantic import BaseModel

from users.app.dtos.pet_stamp_dto import PetStampDto


class PetStampResponseSchema(BaseModel):
    """수집 스탬프 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    pet_id: int
    stamp_spot_id: int
    spot_name: str
    collected_at: str

    @classmethod
    def from_dto(cls, dto: PetStampDto) -> "PetStampResponseSchema":
        return cls(
            pet_id=dto.pet_id,
            stamp_spot_id=dto.stamp_spot_id,
            spot_name=dto.spot_name,
            collected_at=dto.collected_at,
        )
