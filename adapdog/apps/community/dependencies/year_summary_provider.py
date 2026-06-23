from __future__ import annotations

import logging

# year_summary_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from community.adapter.outbound.orm.year_summary_orm import YearSummaryOrm  # noqa: F401
from community.adapter.outbound.repositories.year_summary_repository import MockYearSummaryRepository
from community.app.ports.input.year_summary_use_case import YearSummaryUseCase
from community.app.ports.output.year_summary_port import YearSummaryPort
from community.app.use_cases.year_summary_interactor import YearSummaryInteractor

logger = logging.getLogger(__name__)


def get_year_summary_repository() -> YearSummaryPort:
    """연말 결산 DB 미연동 단계 → mock repository."""
    logger.info("[provider] year_summary: mock 데이터 사용")
    return MockYearSummaryRepository()


def get_year_summary_use_case() -> YearSummaryUseCase:
    return YearSummaryInteractor(repository=get_year_summary_repository())
