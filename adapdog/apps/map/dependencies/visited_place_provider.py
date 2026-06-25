from __future__ import annotations

import logging
from functools import lru_cache

from core.config import DATABASE_URL
from map.adapter.outbound.repositories.visited_place_repository import (
    DbVisitedPlaceRepository,
    EmptyVisitedPlaceRepository,
)
from map.app.ports.input.visited_place_use_case import VisitedPlaceUseCase
from map.app.ports.output.visited_place_port import VisitedPlacePort
from map.app.use_cases.visited_place_interactor import VisitedPlaceInteractor

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_visited_place_repository() -> VisitedPlacePort:
    """DB가 있으면 read 모델, 없으면 빈 발자국 폴백(방문 데이터가 DB에만 있으므로)."""
    if DATABASE_URL:
        logger.info("[provider] visited_place: DB read 모델 사용")
        return DbVisitedPlaceRepository()
    logger.info("[provider] visited_place: DB 없음 → 빈 발자국")
    return EmptyVisitedPlaceRepository()


def get_visited_place_use_case() -> VisitedPlaceUseCase:
    return VisitedPlaceInteractor(repository=get_visited_place_repository())
