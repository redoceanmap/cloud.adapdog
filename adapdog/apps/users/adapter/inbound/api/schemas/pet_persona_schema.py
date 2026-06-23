from __future__ import annotations

from pydantic import BaseModel

from users.app.dtos.pet_persona_dto import PetPersonaDto


class PetPersonaResponseSchema(BaseModel):
    """페르소나 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    pet_id: int
    intro_text: str
    hero_image_url: str
    mascot_image_url: str
    tone: str
    created_at: str

    @classmethod
    def from_dto(cls, dto: PetPersonaDto) -> "PetPersonaResponseSchema":
        return cls(
            pet_id=dto.pet_id,
            intro_text=dto.intro_text,
            hero_image_url=dto.hero_image_url,
            mascot_image_url=dto.mascot_image_url,
            tone=dto.tone,
            created_at=dto.created_at,
        )
