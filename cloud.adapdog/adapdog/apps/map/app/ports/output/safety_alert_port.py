from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.value_objects.safety_alert_vo import Weather


class WeatherPort(ABC):
    """지역 날씨 조회 출력 포트.

    구현체(목/기상청 API)는 repository에 둔다. 인터랙터는 이 추상에만 의존.
    """

    @abstractmethod
    async def current(self, region: str) -> Weather:
        """지역의 현재 날씨를 조회한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="safety_alert",
            message="여행 안전·위험 알리미 기능입니다. 연동 정상!",
            trail=["repository"],
        )
