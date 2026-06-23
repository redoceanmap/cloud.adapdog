from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from care.app.dtos.care_reminder_dto import CareReminderDto


class CareReminderUseCase(ABC):
    """케어 알림 조회 입력 포트."""

    @abstractmethod
    async def list_reminders(self, pet_id: Optional[int] = None) -> list[CareReminderDto]:
        """반려동물(선택)로 케어 알림을 조회한다. pet_id가 없으면 전체."""
        ...
