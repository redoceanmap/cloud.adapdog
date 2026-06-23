from __future__ import annotations

import logging

# stamp_spot_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from map.adapter.outbound.orm.stamp_spot_orm import StampSpotOrm  # noqa: F401
from map.adapter.outbound.repositories.stamp_spot_repository import MockStampSpotRepository
from map.app.ports.input.stamp_spot_use_case import StampSpotUseCase
from map.app.ports.output.stamp_spot_port import StampSpotPort
from map.app.use_cases.stamp_spot_interactor import StampSpotInteractor

logger = logging.getLogger(__name__)


def get_stamp_spot_repository() -> StampSpotPort:
    """스탬프 공공데이터 미연동 단계 → mock repository."""
    logger.info("[provider] stamp_spot: mock 데이터 사용")
    return MockStampSpotRepository()


def get_stamp_spot_use_case() -> StampSpotUseCase:
    return StampSpotInteractor(repository=get_stamp_spot_repository())
