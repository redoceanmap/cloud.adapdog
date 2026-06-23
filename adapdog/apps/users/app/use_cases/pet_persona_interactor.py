from __future__ import annotations

import logging
from typing import Optional

from users.app.dtos.pet_persona_dto import PetPersonaDto
from users.app.ports.input.pet_persona_use_case import PetPersonaUseCase
from users.app.ports.output.pet_persona_port import PetPersonaPort

logger = logging.getLogger(__name__)


class PetPersonaInteractor(PetPersonaUseCase):
    """페르소나 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: PetPersonaPort) -> None:
        self.repository = repository

    async def get_persona(self, pet_id: int) -> Optional[PetPersonaDto]:
        persona = await self.repository.find_persona(pet_id)
        logger.info("[PetPersonaInteractor] get_persona | pet_id=%s → %s", pet_id, "있음" if persona else "없음")
        if persona is None:
            return None
        return PetPersonaDto(
            pet_id=persona.pet_id,
            intro_text=persona.intro_text,
            hero_image_url=persona.hero_image_url,
            mascot_image_url=persona.mascot_image_url,
            tone=persona.tone,
            created_at=persona.created_at,
        )
