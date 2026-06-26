from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.entities.restaurant_entity import Restaurant
from map.domain.value_objects.pet_place_vo import Coordinate


class RestaurantPort(ABC):
    """식사 정류장 식당 조회 출력 포트. 구현체(CSV)는 repository에 둔다."""

    @abstractmethod
    async def nearby_meal(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int = 1,
    ) -> list[Restaurant]:
        """좌표 인근 식당을 펫동반 우선·이미지 보유 가산으로 골라 반환한다.

        exclude_names(이미 코스에 넣은 식당명)는 제외한다.
        """
        ...
