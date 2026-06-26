from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from trips.app.dtos.itinerary_dto import ItineraryDto


class ItineraryUseCase(ABC):
    """저장된 코스 조회 입력 포트."""

    @abstractmethod
    async def list_itineraries(self, pet_id: Optional[int] = None) -> list[ItineraryDto]:
        """반려동물(선택)로 저장된 코스를 조회한다. pet_id가 없으면 전체."""
        ...
