from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PetPersonaDto:
    """페르소나 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    pet_id: int
    intro_text: str
    hero_image_url: str
    mascot_image_url: str
    tone: str
    created_at: str
