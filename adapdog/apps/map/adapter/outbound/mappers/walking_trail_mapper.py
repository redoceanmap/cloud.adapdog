from __future__ import annotations

from map.domain.entities.walking_trail_entity import WalkingTrail


class WalkingTrailMapper:
    """WalkingTrailOrm Row → WalkingTrail 엔티티 (DbWalkingTrailRepository용).

    DB 시드 전환 시 region JOIN 결과를 도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다.
    """

    @staticmethod
    def to_entity(orm, region_name: str = "") -> WalkingTrail:
        return WalkingTrail(
            id=orm.id,
            name=orm.name,
            region=region_name,
            distance_km=orm.distance_km,
            difficulty=orm.difficulty,
            duration=orm.duration,
            description=orm.description,
            route_info=orm.route_info,
        )
