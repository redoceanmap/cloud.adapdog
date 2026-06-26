from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from trips.app.dtos.itinerary_dto import ItineraryDto, SaveItineraryInput


class ItineraryUseCase(ABC):
    """저장된 코스 조회·저장 입력 포트."""

    @abstractmethod
    async def list_itineraries(self, pet_id: Optional[int] = None) -> list[ItineraryDto]:
        """반려동물(선택)로 저장된 코스를 조회한다. pet_id가 없으면 전체."""
        ...

    @abstractmethod
    async def save_itinerary(self, data: SaveItineraryInput) -> ItineraryDto:
        """채팅으로 만든 코스를 저장한다."""
        ...

    @abstractmethod
    async def update_itinerary(self, itinerary_id: int, data: SaveItineraryInput) -> ItineraryDto | None:
        """저장된 코스를 갱신한다."""
        ...

    @abstractmethod
    async def delete_itinerary(self, itinerary_id: int) -> bool:
        """저장된 코스를 삭제한다."""
        ...
