from __future__ import annotations

import logging

from users.app.ports.input.pet_activity_use_case import PetActivityUseCase
from users.app.ports.output.pet_activity_port import PetActivityPort
from users.domain.entities.pet_activity_entity import PetActivity
from users.domain.value_objects.pet_activity_vo import ActionType

logger = logging.getLogger(__name__)


class PetActivityInteractor(PetActivityUseCase):
    """반려동물 행동 기록 인터랙터. 저장 구현(인메모리/DB)은 알지 못한다(DIP)."""

    def __init__(self, repository: PetActivityPort) -> None:
        self.repository = repository

    async def record(self, pet_id: int, facility_id: int, action_type: str) -> PetActivity:
        activity = PetActivity(
            id=None,
            pet_id=pet_id,
            facility_id=facility_id,
            action_type=ActionType.from_raw(action_type),
        )
        saved = await self.repository.save(activity)
        logger.info(
            "[PetActivityInteractor] record | pet=%s facility=%s action=%s",
            pet_id, facility_id, saved.action_type.value,
        )
        return saved

    async def list_by_pet(self, pet_id: int) -> list[PetActivity]:
        return await self.repository.find_by_pet(pet_id)
