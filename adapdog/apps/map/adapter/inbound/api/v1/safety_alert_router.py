from __future__ import annotations

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.safety_alert_schema import SafetyAlertSchema
from map.app.dtos.safety_alert_dto import SafetyAlertResponse
from map.app.ports.input.safety_alert_use_case import SafetyAlertUseCase
from map.dependencies.safety_alert_provider import get_safety_alert_use_case

safety_alert_router = APIRouter(prefix="/safety-alert", tags=["safety-alert"])


@safety_alert_router.post("/check")
async def check_safety(
    schema: SafetyAlertSchema,
    use_case: SafetyAlertUseCase = Depends(get_safety_alert_use_case),
) -> SafetyAlertResponse:
    return await use_case.assess(schema)
