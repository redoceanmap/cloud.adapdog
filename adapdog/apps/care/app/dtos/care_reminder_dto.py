from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CareReminderDto:
    """케어 알림 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    type: str
    label: str
    interval_min: int
    scheduled_time: str
    enabled: bool
