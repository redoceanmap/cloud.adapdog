from __future__ import annotations

import logging

# decoration_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from creative.adapter.outbound.orm.decoration_orm import DecorationOrm  # noqa: F401
from creative.adapter.outbound.repositories.decoration_repository import MockDecorationRepository
from creative.app.ports.input.decoration_use_case import DecorationUseCase
from creative.app.ports.output.decoration_port import DecorationPort
from creative.app.use_cases.decoration_interactor import DecorationInteractor

logger = logging.getLogger(__name__)


def get_decoration_repository() -> DecorationPort:
    """꾸미기 산출 미연동 단계 → mock repository."""
    logger.info("[provider] decoration: mock 데이터 사용")
    return MockDecorationRepository()


def get_decoration_use_case() -> DecorationUseCase:
    return DecorationInteractor(repository=get_decoration_repository())
