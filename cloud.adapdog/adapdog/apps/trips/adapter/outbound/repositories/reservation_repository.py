from __future__ import annotations

from typing import Optional

from trips.app.ports.output.reservation_port import ReservationPort
from trips.domain.entities.reservation_entity import Reservation


class MockReservationRepository(ReservationPort):
    """데이터 없는 단계의 mock 예약 — 체리의 전주 데모 시나리오용.

    DB 시드로 전환 시 DbReservationRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        Reservation(
            id=1,
            itinerary_id=1,
            pet_id=1,
            type="restaurant",
            place_name="멍멍식당",
            party_size=2,
            price="32,000원",
            status="예약완료",
            reserved_at="2026-06-25",
        ),
        Reservation(
            id=2,
            itinerary_id=1,
            pet_id=1,
            type="lodging",
            place_name="한옥 펜스테이",
            party_size=2,
            price="120,000원",
            status="예약완료",
            reserved_at="2026-06-25",
        ),
    )

    async def find_reservations(self, pet_id: Optional[int]) -> list[Reservation]:
        if pet_id is not None:
            return [r for r in self._DATA if r.pet_id == pet_id]
        return list(self._DATA)
