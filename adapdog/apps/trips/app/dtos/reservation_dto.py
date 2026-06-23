from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ReservationDto:
    """예약 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    itinerary_id: int
    pet_id: int
    type: str
    place_name: str
    party_size: int
    price: str
    status: str
    reserved_at: str
