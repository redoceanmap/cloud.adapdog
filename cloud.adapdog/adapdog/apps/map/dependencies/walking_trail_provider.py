from __future__ import annotations

import logging

from core.config import DATABASE_URL

# walking_trail_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from map.adapter.outbound.orm.walking_trail_orm import WalkingTrailOrm  # noqa: F401
from map.adapter.outbound.repositories.walking_trail_repository import (
    DbWalkingTrailRepository,
    MockWalkingTrailRepository,
)
from map.app.ports.input.walking_trail_use_case import WalkingTrailUseCase
from map.app.ports.output.walking_trail_port import WalkingTrailPort
from map.app.use_cases.walking_trail_interactor import WalkingTrailInteractor

logger = logging.getLogger(__name__)


def get_walking_trail_repository() -> WalkingTrailPort:
    """DB(전국길관광정보 적재) > 목 순으로 데이터원 선택."""
    if DATABASE_URL:
        logger.info("[provider] walking_trail: 3NF DB 사용")
        return DbWalkingTrailRepository()
    logger.info("[provider] walking_trail: 목 데이터 사용")
    return MockWalkingTrailRepository()


def get_walking_trail_use_case() -> WalkingTrailUseCase:
    return WalkingTrailInteractor(repository=get_walking_trail_repository())
