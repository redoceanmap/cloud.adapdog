from __future__ import annotations

import logging
from typing import Optional

from creative.app.dtos.decoration_template_dto import DecorationTemplateDto
from creative.app.ports.input.decoration_template_use_case import DecorationTemplateUseCase
from creative.app.ports.output.decoration_template_port import DecorationTemplatePort

logger = logging.getLogger(__name__)


class DecorationTemplateInteractor(DecorationTemplateUseCase):
    """꾸미기 템플릿 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: DecorationTemplatePort) -> None:
        self.repository = repository

    async def list_templates(self, theme: Optional[str] = None) -> list[DecorationTemplateDto]:
        templates = await self.repository.find_templates(theme)
        logger.info("[DecorationTemplateInteractor] list_templates | theme=%s → %d건", theme, len(templates))
        return [
            DecorationTemplateDto(
                id=t.id, name=t.name, theme=t.theme,
                thumbnail_url=t.thumbnail_url, source=t.source,
            )
            for t in templates
        ]
