from __future__ import annotations

import logging

# decoration_template_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from creative.adapter.outbound.orm.decoration_template_orm import DecorationTemplateOrm  # noqa: F401
from creative.adapter.outbound.repositories.decoration_template_repository import MockDecorationTemplateRepository
from creative.app.ports.input.decoration_template_use_case import DecorationTemplateUseCase
from creative.app.ports.output.decoration_template_port import DecorationTemplatePort
from creative.app.use_cases.decoration_template_interactor import DecorationTemplateInteractor

logger = logging.getLogger(__name__)


def get_decoration_template_repository() -> DecorationTemplatePort:
    """템플릿 시드 미연동 단계 → mock repository."""
    logger.info("[provider] decoration_template: mock 데이터 사용")
    return MockDecorationTemplateRepository()


def get_decoration_template_use_case() -> DecorationTemplateUseCase:
    return DecorationTemplateInteractor(repository=get_decoration_template_repository())
