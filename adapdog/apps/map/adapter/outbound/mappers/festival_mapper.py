from __future__ import annotations

from map.domain.entities.festival_entity import Festival


class FestivalMapper:
    """FestivalOrm Row → Festival 엔티티 (DbFestivalRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 region JOIN 결과를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, region_name: str = "") -> Festival:
        return Festival(
            id=orm.id,
            name=orm.name,
            region=region_name,
            start_date=orm.start_date,
            end_date=orm.end_date,
            pet_allowed=orm.pet_allowed,
            source=orm.source,
        )
