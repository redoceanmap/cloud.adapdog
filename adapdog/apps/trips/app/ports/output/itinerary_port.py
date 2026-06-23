from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from trips.domain.entities.itinerary_entity import Itinerary


class ItineraryPort(ABC):
    """저장된 코스 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_itineraries(self, pet_id: Optional[int]) -> list[Itinerary]:
        """반려동물(선택)로 저장된 코스 도메인 엔티티를 조회한다."""
        ...
