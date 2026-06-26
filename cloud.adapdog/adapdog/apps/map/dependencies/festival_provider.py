from __future__ import annotations

import logging

# festival_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from map.adapter.outbound.orm.festival_orm import FestivalOrm  # noqa: F401
from map.adapter.outbound.repositories.festival_repository import MockFestivalRepository
from map.app.ports.input.festival_use_case import FestivalUseCase
from map.app.ports.output.festival_port import FestivalPort
from map.app.use_cases.festival_interactor import FestivalInteractor

logger = logging.getLogger(__name__)


def get_festival_repository() -> FestivalPort:
    """축제 공공데이터 미연동 단계 → mock repository."""
    logger.info("[provider] festival: mock 데이터 사용")
    return MockFestivalRepository()


def get_festival_use_case() -> FestivalUseCase:
    return FestivalInteractor(repository=get_festival_repository())
