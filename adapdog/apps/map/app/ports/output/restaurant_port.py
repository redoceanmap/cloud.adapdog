from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.entities.restaurant_entity import Restaurant
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize


class RestaurantPort(ABC):
    """식사 정류장 식당 조회 출력 포트. 구현체(CSV)는 repository에 둔다."""

    @abstractmethod
    async def nearby_meal(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int = 1,
        pet_size: PetSize = PetSize.UNKNOWN,
    ) -> list[Restaurant]:
        """좌표 인근에서 우리 아이(pet_size)를 받는 펫동반 식당만 골라 반환한다.

        exclude_names(이미 코스에 넣은 식당명)는 제외한다. 동반 불가/크기 미허용 식당은
        후보에서 빠진다(입장 판정과 동일 기준).
        """
        ...
