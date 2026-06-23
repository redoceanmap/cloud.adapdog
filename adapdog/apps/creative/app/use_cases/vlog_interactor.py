from __future__ import annotations

import logging
from typing import Optional

from creative.app.dtos.vlog_dto import VlogClipDto, VlogDto
from creative.app.ports.input.vlog_use_case import VlogUseCase
from creative.app.ports.output.vlog_port import VlogPort

logger = logging.getLogger(__name__)


class VlogInteractor(VlogUseCase):
    """브이로그 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다(클립 중첩 포함)."""

    def __init__(self, repository: VlogPort) -> None:
        self.repository = repository

    async def list_vlogs(self, pet_id: Optional[int] = None) -> list[VlogDto]:
        vlogs = await self.repository.find_vlogs(pet_id)
        logger.info("[VlogInteractor] list_vlogs | pet_id=%s → %d건", pet_id, len(vlogs))
        return [
            VlogDto(
                id=v.id, pet_id=v.pet_id, itinerary_id=v.itinerary_id,
                tone=v.tone, video_url=v.video_url, created_at=v.created_at,
                clips=[
                    VlogClipDto(seq=c.seq, source_type=c.source_type, media_url=c.media_url)
                    for c in v.clips
                ],
            )
            for v in vlogs
        ]
