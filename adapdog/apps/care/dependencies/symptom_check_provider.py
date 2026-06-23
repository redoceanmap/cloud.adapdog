from __future__ import annotations

import logging

# symptom_check_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from care.adapter.outbound.orm.symptom_check_orm import SymptomCheckOrm  # noqa: F401
from care.adapter.outbound.repositories.symptom_check_repository import MockSymptomCheckRepository
from care.app.ports.input.symptom_check_use_case import SymptomCheckUseCase
from care.app.ports.output.symptom_check_port import SymptomCheckPort
from care.app.use_cases.symptom_check_interactor import SymptomCheckInteractor

logger = logging.getLogger(__name__)


def get_symptom_check_repository() -> SymptomCheckPort:
    """증상 체크 데이터 미연동 단계 → mock repository."""
    logger.info("[provider] symptom_check: mock 데이터 사용")
    return MockSymptomCheckRepository()


def get_symptom_check_use_case() -> SymptomCheckUseCase:
    return SymptomCheckInteractor(repository=get_symptom_check_repository())
