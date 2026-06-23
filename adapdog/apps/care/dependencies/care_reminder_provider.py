from __future__ import annotations

import logging

# care_reminder_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from care.adapter.outbound.orm.care_reminder_orm import CareReminderOrm  # noqa: F401
from care.adapter.outbound.repositories.care_reminder_repository import MockCareReminderRepository
from care.app.ports.input.care_reminder_use_case import CareReminderUseCase
from care.app.ports.output.care_reminder_port import CareReminderPort
from care.app.use_cases.care_reminder_interactor import CareReminderInteractor

logger = logging.getLogger(__name__)


def get_care_reminder_repository() -> CareReminderPort:
    """케어 알림 데이터 미연동 단계 → mock repository."""
    logger.info("[provider] care_reminder: mock 데이터 사용")
    return MockCareReminderRepository()


def get_care_reminder_use_case() -> CareReminderUseCase:
    return CareReminderInteractor(repository=get_care_reminder_repository())
