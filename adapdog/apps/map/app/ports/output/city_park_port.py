from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.entities.city_park_entity import CityPark
from map.domain.value_objects.pet_place_vo import Coordinate


class CityParkPort(ABC):
    """야외(산책) 슬롯 공원 조회 출력 포트. 구현체(DB/CSV)는 repository에 둔다."""

    @abstractmethod
    async def nearby(self, near: Coordinate, limit: int = 6) -> list[CityPark]:
        """좌표 인근의 산책 적합 공원을 가까운 순으로 반환한다(놀이터성 어린이공원 제외)."""
        ...
