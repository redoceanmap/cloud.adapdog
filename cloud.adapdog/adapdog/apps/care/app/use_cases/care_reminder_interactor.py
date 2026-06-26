from __future__ import annotations

import logging
from typing import Optional

from care.app.dtos.care_reminder_dto import CareReminderDto
from care.app.ports.input.care_reminder_use_case import CareReminderUseCase
from care.app.ports.output.care_reminder_port import CareReminderPort

logger = logging.getLogger(__name__)


class CareReminderInteractor(CareReminderUseCase):
    """케어 알림 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: CareReminderPort) -> None:
        self.repository = repository

    async def list_reminders(self, pet_id: Optional[int] = None) -> list[CareReminderDto]:
        reminders = await self.repository.find_reminders(pet_id)
        logger.info("[CareReminderInteractor] list_reminders | pet_id=%s → %d건", pet_id, len(reminders))
        return [
            CareReminderDto(
                id=r.id, pet_id=r.pet_id, type=r.type, label=r.label,
                interval_min=r.interval_min, scheduled_time=r.scheduled_time, enabled=r.enabled,
            )
            for r in reminders
        ]
