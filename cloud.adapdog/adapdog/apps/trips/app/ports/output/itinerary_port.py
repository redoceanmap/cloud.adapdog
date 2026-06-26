from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Optional

from trips.domain.entities.itinerary_entity import Itinerary

if TYPE_CHECKING:
    from trips.app.dtos.itinerary_dto import SaveItineraryInput


class ItineraryPort(ABC):
    """저장된 코스 조회·저장 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_itineraries(self, pet_id: Optional[int]) -> list[Itinerary]:
        """반려동물(선택)로 저장된 코스 도메인 엔티티를 조회한다."""
        ...

    @abstractmethod
    async def save_itinerary(self, data: "SaveItineraryInput") -> Itinerary:
        """새 코스를 저장한다."""
        ...

    @abstractmethod
    async def update_itinerary(self, itinerary_id: int, data: "SaveItineraryInput") -> Itinerary | None:
        """기존 코스를 갱신한다. 없으면 None."""
        ...

    @abstractmethod
    async def delete_itinerary(self, itinerary_id: int) -> bool:
        """코스를 삭제한다. 성공 시 True."""
        ...
