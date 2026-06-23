from __future__ import annotations

from community.domain.entities.favorite_entity import Favorite


class FavoriteMapper:
    """FavoriteOrm Row → Favorite 엔티티 (DbFavoriteRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 facility JOIN
    결과(facility_name)를 합쳐 도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, facility_name: str = "") -> Favorite:
        return Favorite(
            account_id=orm.account_id,
            facility_id=orm.facility_id,
            facility_name=facility_name,
            created_at=orm.created_at,
        )
