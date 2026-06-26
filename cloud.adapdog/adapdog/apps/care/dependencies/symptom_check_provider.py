from __future__ import annotations

import logging

from core.config import GEMINI_API_KEY, GEMINI_MODEL

# symptom_check_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from care.adapter.outbound.orm.symptom_check_orm import SymptomCheckOrm  # noqa: F401
from care.adapter.outbound.repositories.symptom_check_repository import (
    MockSymptomCheckRepository,
    RuleBasedSymptomTriageAgent,
)
from care.app.ports.input.symptom_check_use_case import SymptomCheckUseCase
from care.app.ports.output.symptom_check_port import SymptomCheckPort, SymptomTriageAgentPort
from care.app.use_cases.symptom_check_interactor import SymptomCheckInteractor

logger = logging.getLogger(__name__)


def get_symptom_check_repository() -> SymptomCheckPort:
    """증상 체크 데이터 미연동 단계 → mock repository."""
    logger.info("[provider] symptom_check: mock 데이터 사용")
    return MockSymptomCheckRepository()


def get_symptom_triage_agent() -> SymptomTriageAgentPort:
    """GEMINI_API_KEY가 있으면 Gemini 증상 안내, 없으면 규칙기반 폴백."""
    if GEMINI_API_KEY:
        from care.adapter.outbound.repositories.symptom_check_repository import GeminiSymptomTriageAgent

        logger.info("[provider] Gemini 증상 안내 에이전트 사용")
        return GeminiSymptomTriageAgent(api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL)
    logger.info("[provider] GEMINI_API_KEY 없음 → 규칙기반 증상 안내")
    return RuleBasedSymptomTriageAgent()


def get_symptom_check_use_case() -> SymptomCheckUseCase:
    return SymptomCheckInteractor(
        repository=get_symptom_check_repository(),
        triage_agent=get_symptom_triage_agent(),
    )
