from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from care.domain.entities.care_reminder_entity import CareReminder


class CareReminderPort(ABC):
    """케어 알림 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_reminders(self, pet_id: Optional[int]) -> list[CareReminder]:
        """반려동물(선택)로 케어 알림 도메인 엔티티를 조회한다."""
        ...
