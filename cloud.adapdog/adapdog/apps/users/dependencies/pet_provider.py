from __future__ import annotations

import logging
from functools import lru_cache

from fastapi import Depends

from core.config import DATABASE_URL
from users.adapter.outbound.repositories.pet_repository import (
    DbPetRepository,
    InMemoryPetRepository,
)
from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.app.ports.input.pet_use_case import PetUseCase
from users.app.ports.output.pet_port import PetPort
from users.app.use_cases.pet_interactor import PetInteractor
from users.dependencies.breed_catalog_provider import get_breed_catalog_use_case

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_pet_repository() -> PetPort:
    """DB > 인메모리 순으로 선택. 인메모리는 상태 보존을 위해 싱글톤으로 둔다."""
    if DATABASE_URL:
        logger.info("[provider] pet: DB 사용")
        return DbPetRepository()
    logger.info("[provider] pet: 인메모리(개발) 사용")
    return InMemoryPetRepository()


def get_pet_use_case(
    breed_catalog: BreedCatalogUseCase = Depends(get_breed_catalog_use_case),
) -> PetUseCase:
    return PetInteractor(repository=get_pet_repository(), breed_catalog=breed_catalog)
