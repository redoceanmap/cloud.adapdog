from __future__ import annotations

import logging

from core.config import DATABASE_URL
from users.adapter.outbound.repositories.breed_catalog_repository import (
    DbBreedCatalogRepository,
    MockBreedCatalogRepository,
)
from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.app.ports.output.breed_catalog_port import BreedCatalogPort
from users.app.use_cases.breed_catalog_interactor import BreedCatalogInteractor

logger = logging.getLogger(__name__)


def get_breed_catalog_repository() -> BreedCatalogPort:
    """DB > 목 순으로 견종 데이터원 선택."""
    if DATABASE_URL:
        logger.info("[provider] breed_catalog: DB 사용")
        return DbBreedCatalogRepository()
    logger.info("[provider] breed_catalog: 목(큐레이션) 데이터 사용")
    return MockBreedCatalogRepository()


def get_breed_catalog_use_case() -> BreedCatalogUseCase:
    return BreedCatalogInteractor(repository=get_breed_catalog_repository())
