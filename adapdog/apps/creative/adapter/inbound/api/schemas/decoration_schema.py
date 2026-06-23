from __future__ import annotations

from pydantic import BaseModel

from creative.app.dtos.decoration_dto import DecorationDto


class DecorationResponseSchema(BaseModel):
    """꾸미기 결과 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    template_id: int
    result_image_url: str
    model3d_url: str
    created_at: str

    @classmethod
    def from_dto(cls, dto: DecorationDto) -> "DecorationResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            template_id=dto.template_id,
            result_image_url=dto.result_image_url,
            model3d_url=dto.model3d_url,
            created_at=dto.created_at,
        )
