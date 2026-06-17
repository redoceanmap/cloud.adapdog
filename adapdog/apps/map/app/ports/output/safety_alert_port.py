from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.value_objects.safety_alert_vo import Weather


class WeatherPort(ABC):
    """지역 날씨 조회 출력 포트.

    구현체(목/기상청 API)는 repository에 둔다. 인터랙터는 이 추상에만 의존.
    """

    @abstractmethod
    async def current(self, region: str) -> Weather:
        """지역의 현재 날씨를 조회한다."""
        ...
