from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from care.adapter.inbound.api.schemas.care_reminder_schema import CareReminderResponseSchema
from care.app.ports.input.care_reminder_use_case import CareReminderUseCase
from care.dependencies.care_reminder_provider import get_care_reminder_use_case

care_reminder_router = APIRouter(prefix="/care-reminder", tags=["care-reminder"])


@care_reminder_router.get("")
async def list_reminders(
    pet_id: Optional[int] = None,
    use_case: CareReminderUseCase = Depends(get_care_reminder_use_case),
) -> list[CareReminderResponseSchema]:
    """D2 케어 알림 — 반려동물(선택)로 조회."""
    reminders = await use_case.list_reminders(pet_id)
    return [CareReminderResponseSchema.from_dto(r) for r in reminders]
