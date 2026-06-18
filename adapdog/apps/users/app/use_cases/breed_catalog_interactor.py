from __future__ import annotations

import logging

from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.app.ports.output.breed_catalog_port import BreedCatalogPort
from users.domain.entities.breed_catalog_entity import BreedProfile

logger = logging.getLogger(__name__)


class BreedCatalogInteractor(BreedCatalogUseCase):
    """견종 표준정보 인터랙터.

    조회는 repository(목/DB)에 위임하고, 미등록 견종이면 BreedProfile.unknown으로
    안전한 기본값을 만들어 등록 흐름이 끊기지 않게 한다.
    """

    def __init__(self, repository: BreedCatalogPort) -> None:
        self.repository = repository

    async def lookup(self, breed: str) -> BreedProfile:
        profile = await self.repository.lookup(breed)
        if profile is None:
            logger.info("[BreedCatalogInteractor] 미등록 견종 → 기본값 | breed=%s", breed)
            return BreedProfile.unknown(breed)
        logger.info("[BreedCatalogInteractor] lookup | breed=%s size=%s", breed, profile.size.value)
        return profile
