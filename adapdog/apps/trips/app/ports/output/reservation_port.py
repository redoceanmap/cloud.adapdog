from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from trips.domain.entities.reservation_entity import Reservation


class ReservationPort(ABC):
    """예약 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_reservations(self, pet_id: Optional[int]) -> list[Reservation]:
        """반려동물(선택)로 예약 도메인 엔티티를 조회한다."""
        ...
