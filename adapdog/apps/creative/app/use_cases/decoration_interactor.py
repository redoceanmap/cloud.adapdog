from __future__ import annotations

import logging
from typing import Optional

from creative.app.dtos.decoration_dto import DecorationDto
from creative.app.ports.input.decoration_use_case import DecorationUseCase
from creative.app.ports.output.decoration_port import DecorationPort

logger = logging.getLogger(__name__)


class DecorationInteractor(DecorationUseCase):
    """꾸미기 결과 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: DecorationPort) -> None:
        self.repository = repository

    async def list_decorations(self, pet_id: Optional[int] = None) -> list[DecorationDto]:
        decorations = await self.repository.find_decorations(pet_id)
        logger.info("[DecorationInteractor] list_decorations | pet_id=%s → %d건", pet_id, len(decorations))
        return [
            DecorationDto(
                id=d.id, pet_id=d.pet_id, template_id=d.template_id,
                result_image_url=d.result_image_url, model3d_url=d.model3d_url,
                created_at=d.created_at,
            )
            for d in decorations
        ]
