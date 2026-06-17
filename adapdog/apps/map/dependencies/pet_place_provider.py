from __future__ import annotations

import logging

from core.config import (
    DATABASE_URL,
    PETPLACE_API_ENDPOINT,
    PETPLACE_API_MAX_ROWS,
    PETPLACE_API_SERVICE_KEY,
)
from map.adapter.outbound.repositories.pet_place_repository import (
    DbPetFriendlyPlaceRepository,
    MockPetFriendlyPlaceRepository,
    OdcloudPetFriendlyPlaceRepository,
)
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.pet_place_port import PetFriendlyPlacePort
from map.app.use_cases.pet_place_interactor import PetPlaceInteractor

logger = logging.getLogger(__name__)


def get_pet_place_repository() -> PetFriendlyPlacePort:
    """DB > odcloud API > 목 순으로 데이터원 선택."""
    if DATABASE_URL:
        logger.info("[provider] pet_place: 3NF DB 사용")
        return DbPetFriendlyPlaceRepository()
    if PETPLACE_API_ENDPOINT and PETPLACE_API_SERVICE_KEY:
        logger.info("[provider] pet_place: odcloud 실 API 사용")
        return OdcloudPetFriendlyPlaceRepository(
            endpoint=PETPLACE_API_ENDPOINT,
            service_key=PETPLACE_API_SERVICE_KEY,
            max_rows=PETPLACE_API_MAX_ROWS,
        )
    logger.info("[provider] pet_place: 목 데이터 사용")
    return MockPetFriendlyPlaceRepository()


def get_pet_place_use_case() -> PetPlaceUseCase:
    return PetPlaceInteractor(repository=get_pet_place_repository())
