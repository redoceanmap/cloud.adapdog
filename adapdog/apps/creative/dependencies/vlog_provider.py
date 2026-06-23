from __future__ import annotations

import logging

# vlog_orm을 임포트해 Base.metadata에 등록(VlogOrm/VlogClipOrm) → create_all_tables가 테이블 생성.
from creative.adapter.outbound.orm.vlog_orm import VlogClipOrm, VlogOrm  # noqa: F401
from creative.adapter.outbound.repositories.vlog_repository import MockVlogRepository
from creative.app.ports.input.vlog_use_case import VlogUseCase
from creative.app.ports.output.vlog_port import VlogPort
from creative.app.use_cases.vlog_interactor import VlogInteractor

logger = logging.getLogger(__name__)


def get_vlog_repository() -> VlogPort:
    """영상 자동 편집 미연동 단계 → mock repository."""
    logger.info("[provider] vlog: mock 데이터 사용")
    return MockVlogRepository()


def get_vlog_use_case() -> VlogUseCase:
    return VlogInteractor(repository=get_vlog_repository())
