from __future__ import annotations

import logging
from typing import Optional

from users.app.dtos.pet_stamp_dto import PetStampDto
from users.app.ports.input.pet_stamp_use_case import PetStampUseCase
from users.app.ports.output.pet_stamp_port import PetStampPort

logger = logging.getLogger(__name__)


class PetStampInteractor(PetStampUseCase):
    """수집 스탬프 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: PetStampPort) -> None:
        self.repository = repository

    async def list_stamps(self, pet_id: Optional[int] = None) -> list[PetStampDto]:
        stamps = await self.repository.find_stamps(pet_id)
        logger.info("[PetStampInteractor] list_stamps | pet_id=%s → %d건", pet_id, len(stamps))
        return [
            PetStampDto(
                pet_id=s.pet_id,
                stamp_spot_id=s.stamp_spot_id,
                spot_name=s.spot_name,
                collected_at=s.collected_at,
            )
            for s in stamps
        ]
