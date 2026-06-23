from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Reservation:
    """예약 — C10/C11(식당·숙소 예약)의 한 항목.

    저장된 코스(itinerary)에 묶인 식당/숙소 예약. type은 restaurant/lodging.
    """

    id: int
    itinerary_id: int
    pet_id: int
    type: str  # restaurant | lodging
    place_name: str
    party_size: int
    price: str
    status: str
    reserved_at: str  # ISO yyyy-mm-dd
