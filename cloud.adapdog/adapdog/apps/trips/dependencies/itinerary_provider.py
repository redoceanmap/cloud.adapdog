from __future__ import annotations

import logging

# itinerary_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from trips.adapter.outbound.orm.itinerary_orm import ItineraryOrm  # noqa: F401
from trips.adapter.outbound.repositories.itinerary_repository import MockItineraryRepository
from trips.app.ports.input.itinerary_use_case import ItineraryUseCase
from trips.app.ports.output.itinerary_port import ItineraryPort
from trips.app.use_cases.itinerary_interactor import ItineraryInteractor

logger = logging.getLogger(__name__)


def get_itinerary_repository() -> ItineraryPort:
    """저장 코스 DB 미연동 단계 → mock repository."""
    logger.info("[provider] itinerary: mock 데이터 사용")
    return MockItineraryRepository()


def get_itinerary_use_case() -> ItineraryUseCase:
    return ItineraryInteractor(repository=get_itinerary_repository())
