from __future__ import annotations

import logging
from typing import Optional

from map.app.dtos.audio_guide_dto import AudioGuideDto
from map.app.ports.input.audio_guide_use_case import AudioGuideUseCase
from map.app.ports.output.audio_guide_port import AudioGuidePort

logger = logging.getLogger(__name__)


class AudioGuideInteractor(AudioGuideUseCase):
    """오디오 가이드 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: AudioGuidePort) -> None:
        self.repository = repository

    async def list_guides(self, facility_id: Optional[int] = None) -> list[AudioGuideDto]:
        guides = await self.repository.find_guides(facility_id)
        logger.info("[AudioGuideInteractor] list_guides | facility_id=%s → %d건", facility_id, len(guides))
        return [
            AudioGuideDto(
                id=g.id,
                facility_id=g.facility_id,
                language=g.language,
                script_text=g.script_text,
                audio_url=g.audio_url,
            )
            for g in guides
        ]
