from __future__ import annotations

from trips.domain.entities.itinerary_entity import Itinerary, ItineraryStop


class ItineraryMapper:
    """ItineraryOrm Row(+stops) → Itinerary 엔티티 (DbItineraryRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 itinerary_stop JOIN 결과를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, region_name: str = "", stops: list[ItineraryStop] | None = None) -> Itinerary:
        return Itinerary(
            id=orm.id,
            pet_id=orm.pet_id,
            title=orm.title,
            region=region_name,
            prompt_text=orm.prompt_text,
            is_saved=orm.is_saved,
            created_at=orm.created_at,
            stops=stops or [],
        )
