from __future__ import annotations

from trips.domain.entities.reservation_entity import Reservation


class ReservationMapper:
    """ReservationOrm Row → Reservation 엔티티 (DbReservationRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 행을 도메인 엔티티로 옮긴다.
    place_name은 ERD 테이블에 없으므로 facility JOIN 결과를 주입한다. 도메인은 ORM을 모른다.
    """

    @staticmethod
    def to_entity(orm, place_name: str = "") -> Reservation:
        return Reservation(
            id=orm.id,
            itinerary_id=orm.itinerary_id,
            pet_id=orm.pet_id,
            type=orm.type,
            place_name=place_name,
            party_size=orm.party_size,
            price=orm.price,
            status=orm.status,
            reserved_at=orm.reserved_at,
        )
