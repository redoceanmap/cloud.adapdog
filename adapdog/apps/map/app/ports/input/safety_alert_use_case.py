from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from map.app.dtos.safety_alert_dto import SafetyAlertResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.safety_alert_schema import SafetyAlertSchema


class SafetyAlertUseCase(ABC):
    """여행 안전·위험 알리미 입력 포트."""

    @abstractmethod
    async def assess(self, schema: "SafetyAlertSchema") -> SafetyAlertResponse:
        """견종 체질과 지역 날씨로 위험도를 산정하고 가까운 동물병원을 안내한다."""
        ...
