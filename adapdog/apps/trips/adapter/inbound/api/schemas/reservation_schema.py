from __future__ import annotations

from pydantic import BaseModel

from trips.app.dtos.reservation_dto import ReservationDto


class ReservationResponseSchema(BaseModel):
    """예약 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    itinerary_id: int
    pet_id: int
    type: str
    place_name: str
    party_size: int
    price: str
    status: str
    reserved_at: str

    @classmethod
    def from_dto(cls, dto: ReservationDto) -> "ReservationResponseSchema":
        return cls(
            id=dto.id,
            itinerary_id=dto.itinerary_id,
            pet_id=dto.pet_id,
            type=dto.type,
            place_name=dto.place_name,
            party_size=dto.party_size,
            price=dto.price,
            status=dto.status,
            reserved_at=dto.reserved_at,
        )
