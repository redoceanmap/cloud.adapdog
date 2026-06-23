from __future__ import annotations

from typing import Optional

from care.app.ports.output.care_reminder_port import CareReminderPort
from care.domain.entities.care_reminder_entity import CareReminder


class MockCareReminderRepository(CareReminderPort):
    """데이터 없는 단계의 mock 케어 알림 — 체리 데모 시나리오용.

    DB 시드로 전환 시 DbCareReminderRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        CareReminder(1, 1, "water", "물 급여", 60, "10:00", True),
        CareReminder(2, 1, "rest", "그늘 휴식", 90, "11:30", True),
        CareReminder(3, 1, "feed", "간식", 180, "13:00", True),
    )

    async def find_reminders(self, pet_id: Optional[int]) -> list[CareReminder]:
        if pet_id is not None:
            return [r for r in self._DATA if r.pet_id == pet_id]
        return list(self._DATA)
