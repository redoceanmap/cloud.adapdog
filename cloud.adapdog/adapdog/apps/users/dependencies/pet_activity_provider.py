from __future__ import annotations

import logging
from functools import lru_cache

from core.config import DATABASE_URL
from users.adapter.outbound.repositories.pet_activity_repository import (
    DbPetActivityRepository,
    InMemoryPetActivityRepository,
)
from users.app.ports.input.pet_activity_use_case import PetActivityUseCase
from users.app.ports.output.pet_activity_port import PetActivityPort
from users.app.use_cases.pet_activity_interactor import PetActivityInteractor

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_pet_activity_repository() -> PetActivityPort:
    """DB > 인메모리 순으로 선택. 인메모리는 상태 보존을 위해 싱글톤으로 둔다."""
    if DATABASE_URL:
        logger.info("[provider] pet_activity: DB 사용")
        return DbPetActivityRepository()
    logger.info("[provider] pet_activity: 인메모리(개발) 사용")
    return InMemoryPetActivityRepository()


def get_pet_activity_use_case() -> PetActivityUseCase:
    return PetActivityInteractor(repository=get_pet_activity_repository())
