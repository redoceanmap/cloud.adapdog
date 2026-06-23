from __future__ import annotations

from pydantic import BaseModel

from care.app.dtos.care_reminder_dto import CareReminderDto


class CareReminderResponseSchema(BaseModel):
    """케어 알림 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    type: str
    label: str
    interval_min: int
    scheduled_time: str
    enabled: bool

    @classmethod
    def from_dto(cls, dto: CareReminderDto) -> "CareReminderResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            type=dto.type,
            label=dto.label,
            interval_min=dto.interval_min,
            scheduled_time=dto.scheduled_time,
            enabled=dto.enabled,
        )
